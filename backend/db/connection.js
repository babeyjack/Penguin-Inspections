// // Database
const mysql = require("mysql2");

// Database Setup (using pool for automatic reconnect behavior)
const db = mysql.createPool({
  host: process.env.MYSQL_HOST || "db",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "Tr2pj7QL0cyxXyK",
  database: process.env.MYSQL_DATABASE || "penguin_inspections",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  multipleStatements: true,
  typeCast: function (field, next) {
    if (
      field.type === "NEWDECIMAL" ||
      field.type === "DECIMAL" ||
      field.type === "FLOAT" ||
      field.type === "DOUBLE"
    ) {
      const val = field.string();
      return val === null ? null : parseFloat(val);
    }
    return next();
  },
});

// Store active transaction context per request
const transactionContexts = new WeakMap();

// Add transaction support to the pool
// This allows existing code to work with transactions
db.beginTransaction = function(callback) {
  db.getConnection((err, connection) => {
    if (err) {
      return callback(err);
    }
    
    connection.beginTransaction((beginErr) => {
      if (beginErr) {
        connection.release();
        return callback(beginErr);
      }
      
      // Create a context object that holds the transactional connection
      const transactionContext = {
        _connection: connection,
        _inTransaction: true,
        query: connection.query.bind(connection),
        commit: function(commitCallback) {
          connection.commit((commitErr) => {
            connection.release();
            if (commitCallback) commitCallback(commitErr);
          });
        },
        rollback: function(rollbackCallback) {
          connection.rollback((rollbackErr) => {
            connection.release();
            if (rollbackCallback) rollbackCallback(rollbackErr);
          });
        },
        release: function() {
          connection.release();
        }
      };
      
      // Temporarily replace db methods for this transaction
      const originalQuery = db.query;
      const originalCommit = db.commit;
      const originalRollback = db.rollback;
      
      db.query = connection.query.bind(connection);
      db.commit = function(callback) {
        connection.commit((err) => {
          // Restore original methods
          db.query = originalQuery;
          db.commit = originalCommit;
          db.rollback = originalRollback;
          connection.release();
          if (callback) callback(err);
        });
      };
      db.rollback = function(callback) {
        connection.rollback((err) => {
          // Restore original methods
          db.query = originalQuery;
          db.commit = originalCommit;
          db.rollback = originalRollback;
          connection.release();
          if (callback) callback(err);
        });
      };
      
      // Call the transaction callback
      callback(null);
    });
  });
};

// Validate connection at startup
db.getConnection((err, connection) => {
  if (err) {
    console.error("Database Connection : " + err);
  } else {
    console.log("MySQL Database Connected");
    connection.release();
  }
});

// Handle runtime errors
db.on("error", (err) => {
  console.error("Database error:", err);
});

module.exports = db;
