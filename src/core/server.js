define([
    "hr/utils",
    "hr/promise"
], function(_, Q) {
    var http = node.require('http');
    var url = node.require('url');
    var send = node.require('send');

    var runningServer = null;

    var stopServer = function() {
        if (!runningServer) return Q();

        var d = Q.defer();

        runningServer.close(function(err) {
            runningServer = null;
            if (err) d.reject(err);
            else d.resolve();
        });

        return d.promise;
    }; 

    var startServer = function(dir, port) {
        port = port || 8004;
        var pre = Q();

        if (runningServer) pre = stopServer();

        return pre
        .then(function() {
            var d = Q.defer();

            runningServer = http.createServer(function(req, res){
                // Render error
                function error(err) {
                    res.statusCode = err.status || 500;
                    res.end(err.message);
                }

                // Redirect to directory's index.html
                function redirect() {
                    res.statusCode = 301;
                    res.setHeader('Location', req.url + '/');
                    res.end('Redirecting to ' + req.url + '/');
                }

                // Send file
                send(req, url.parse(req.url).pathname)
                .root(dir)
                .on('error', error)
                .on('directory', redirect)
                .pipe(res);
            }).listen(port);

            d.resolve({
                port: port
            });

            return d.promise;
        });
    };


    return {
        start: startServer,
        stop: stopServer
    };
});