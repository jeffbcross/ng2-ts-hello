var fs = require('fs');
var path = require('path');
var http2 = require('http2');

var cachedUrls = {};
var angularRequireExp = /require ?\(['"]{1}angular2([^\)\'\"]*)['"]{1}\)/g;
function cacheAll (rootDir) {
  fs.readdirSync(rootDir).forEach(function(file) {
    var fullyQualified = path.resolve(rootDir, file);
    if (fs.statSync(fullyQualified).isFile() && endsWith(file, '.js')) {
      //It's a JS file, cache it!      
      cachedUrls[fullyQualified] = fs.readFileSync(fullyQualified).toString()//.replace(angularRequireExp, 'require("'+path.resolve(__dirname, 'node_modules/angular/modules/angular2', '$1')+'")');
    } else if (!fs.statSync(fullyQualified).isFile()) {
      //It's a directory, recurse!
      cacheAll(fullyQualified);
    }
  });
}

function endsWith(filename, extension) { 
  return filename.indexOf(extension) === filename.length - extension.length;
}

function noExtension (pathname) {
  var exp = /\.[a-z]{1,4}$/;
  return !exp.test(pathname);
}

cacheAll(path.resolve(__dirname, 'node_modules/angular/modules/angular2'));
// console.log('cachedSoFar', cachedUrls);


cachedUrls[__dirname + 'rx.js'] = fs.readFileSync('./rx.js');
cachedUrls[__dirname + 'node_modules/reflect-metadata/Reflect.js'] = fs.readFileSync('./node_modules/reflect-metadata/Reflect.js');

// The callback to handle requests
function onRequest(request, response) {
  if (request.url.indexOf('/angular2') === 0) {
    request.url = '/node_modules/angular/modules/' + request.url;
  }
  var filename = path.join(__dirname, request.url);
  // Work around SystemJS configuration
  if (noExtension(filename)) filename += '.js';
  
  if (cachedUrls[filename]) {
    if (response.push) {
      // Also push down the client js, since it's possible if the requester wants
      // one, they want both.
      // var push = response.push('/client.js');
      // push.writeHead(200);
      // fs.createReadStream(path.join(__dirname, '/client.js')).pipe(push);
    }
    response.end(cachedUrls[filename]);
  }
  // Reading file from disk if it exists and is safe.
  else if ((filename.indexOf(__dirname) === 0) && fs.existsSync(filename) && fs.statSync(filename).isFile()) {
    console.error('cache miss!', filename);
    response.writeHead('200');

    fs.createReadStream(filename).pipe(response);
    cachedUrls[request.url] = fs.readFileSync(filename);
  }

  // Otherwise responding with 404.
  else {
    response.writeHead('404');
    response.end();
  }
}

// Creating a bunyan logger (optional)
var log = require('http2/test/util').createLogger('server');

// Creating the server in plain or TLS mode (TLS mode is the default)
var server;
if (process.env.HTTP2_PLAIN) {
  server = http2.raw.createServer({
    log: console.log.bind(console)
  }, onRequest);
} else {
  server = http2.createServer({
    log: log,
    key: fs.readFileSync(path.join(__dirname, 'node_modules/http2/example/localhost.key')),
    cert: fs.readFileSync(path.join(__dirname, 'node_modules/http2/example/localhost.crt'))
  }, onRequest);
}
console.log('listening on ', process.env.HTTP2_PORT || 8080);
server.listen(process.env.HTTP2_PORT || 8080);
