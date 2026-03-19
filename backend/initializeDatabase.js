const fs = require("fs");
const path = require("path");
const db = require("./db/connection");

async function initializeDatabase() {
  try {
    // Check if users table exists
    const [tables] = await db.promise().query(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?",
      ["penguin_inspections", "users"]
    );

    if (tables.length === 0) {
      console.log("Database not properly initialized. Running seed script...");
      const seedPath = path.join(__dirname, "../mySQL/dev-seed-full.sql");
      const seedSQL = fs.readFileSync(seedPath, "utf8");
      
      // Execute the entire seed script at once (multipleStatements is enabled)
      try {
        await db.promise().query(seedSQL);
        console.log("Database seeding completed successfully.");
      } catch (err) {
        // Try alternative: execute line by line
        console.warn("Full script execution failed, attempting line-by-line...");
        const lines = seedSQL.split("\n");
        let statement = "";
        
        for (const line of lines) {
          const trimmed = line.trim();
          
          // Skip comments and empty lines
          if (!trimmed || trimmed.startsWith("--") || trimmed.startsWith("/*")) {
            continue;
          }
          
          statement += line + "\n";
          
          // Execute when we hit a semicolon
          if (trimmed.endsWith(";")) {
            try {
              await db.promise().query(statement);
            } catch (err) {
              if (!err.message.includes("already exists")) {
                console.error("SQL error (non-critical):", err.message.substring(0, 100));
              }
            }
            statement = "";
          }
        }
        
        console.log("Database seeding completed with line-by-line fallback.");
      }
    } else {
      console.log("Database already initialized (users table exists).");
    }
  } catch (err) {
    console.error("Database initialization error:", err);
    throw err;
  }
}

module.exports = { initializeDatabase };
