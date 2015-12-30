var app = require('express')();
var statics = require('serve-static');
app.use('/', statics('build'));
app.use(function(req, res, next) {
    req.originalUrl = '/';
    req.url = '/';
    next();
});
app.listen(8080, function(err) {
    if (err) console.error("error", err);
    else console.log('listening on port 8080');
});
