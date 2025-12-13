//const http = require('http');
const filesystem = require('fs')
const requesthandler = (req, res) => {
    //const server = http.createServer((req, res) => {

    //response to the request

    const method = req.method;
    const url = req.url;

    if (url === '/') {
        res.setHeader('content-type', 'text/html') // for sending response to browser and we should give the primary info for how to show the data and we can send type of data like html data or json
        res.write('<html>')  // we can send data to browser using write method
        res.write('<head><title>hello from server</title></head>')
        //res.write('<body><form enctype="multipart/form-data"action="/message" method="POST"><input type="file" name="file"><input type="text" name="username"><input type="submit" name="send"></form></body>')
        res.write('<body><form action="/message" method="POST"><input type="text" name="username"> <input type="submit" value="send"></form></body>')
        res.write('</html>')
        return res.end();  // it is used to end the response process    
    }

    //redirecting

    if (url === '/message' && method == 'POST') {
        const body = [];

        //for large data browser sends info as small parts so we have bought the data as small parts(memory chunk)

        req.on('data', (chunk) => {
            //console.log('chunk:');
            //console.log(chunk)
            body.push(chunk)//for adding  and storing chunked into array

        })// we can know the data brought from browser and get data from browser,call back function for after getting the data which statement should show

        return req.on('end', () => { //by using return it will not return outside the if statement values

            //parse means changeable
            console.log('end event received')
            const parsedbody = Buffer.concat(body).toString();//convert the buffer into string
            const message = parsedbody.split('=')//separate the data(key value pair username=innffi) into tow words

            //filesystem.writeFilesync('hello.txt',message[1])//writefilesync function makes wait below codes execution(when it comes to file management) so without blockage to execute we have to use writefile only 
            // filesystem.writeFileSync('hello.txt', 'file created ')
            filesystem.writeFile('hello.txt', message[1], (err) => {

                console.log("file created");
                res.setHeader('Location', '/') //redirected to the above if statement
                res.statusCode = 302;// redirect code
                return res.end()
            });

        }) //when the browser sends data cpmpletely after that node js sends end event


        //filesystem.writeFileSync('hello.txt', 'file created ')//create file
        //console.log("file created")
        //res.setHeader('Location', '/') //redirected to the above if statement
        //res.statusCode = 302;// redirect code
        //return res.end()
    }

    res.write('<html>')
    res.write('<body><h1>Hello World</h1></body>')
    res.write('</html>')
    res.end();
};
//server.listen(8080);
//};

//const server=http.createServer((req,res)=>{
//console.log(req)
//console.log(req.url) we can get uri ,which uri we are requeting for through this url
// process.exit(); to stop the server's listener that means event loop{(ctrl+c)}
//console.log(req.method) browser sends request for accessing information if we getting infromation from the server means use post 
//console.log(req.headers) it contains info about where request comes from ,what kind of data it accept,where we send info 
//});
//module.exports=requesthandler;//for one function
//module.exports = { handler: requesthandler, sometext: 'printing something' };//for exporting more function using object
//exports.handler=requesthandler;//another ways to export
//exports.sometext='printing something';

//for exporting to js
module.exports.handler=requesthandler;
module.exports.sometext="printing something"
