var app = require('express')();
var statics = require('serve-static');
app.use('/static', statics('build'));
app.use(statics('index.html'));
app.listen(8080, function(err) {
    if (err) console.error("error", err);
    else console.log('listening on port 8080');
});
