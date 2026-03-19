module.exports = function ensureSecure(req, res, next) {
    if(req.secure) {
        return next();
    } else {
        res.redirect("https://" + req.hostname + req.originalUrl);
    }
}