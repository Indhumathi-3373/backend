// const reqhandler=require('./routes') for one function importing
const route=require('./routes')
const http=require('http')
console.log(route.sometext);
console.log('nodemon is installed running cmd as --save-dev')
const server=http.createServer(route.handler);
server.listen(8080);