var urls = require('./urls');
var fs = require('fs');
var join = require('path');
var argv = require('minimist')(process.argv.slice(2));
const https = require('https');
var blend = require('@mapbox/blend');


let greeting = "Hello";
let who = "You";
let width = 400;
let height = 400;
let colour = "pink";
let size =100;

let firstRequest = {
    url : `https://catcass.com/cal/says/${greeting}?width=${width}&height=${height}&colour=${colour}&size=${size}`,
    encoding : 'binary'
}


let secondRequest = {
    hostname: urls.baseUrl+`${greeting}?width=${width}&height=${height}&colour=${colour}&size=${size}`,
    method: 'GET'
}

  getFirstRequest(firstRequest).then((firstRequest) =>{
   if(firstRequest){
         getSecondrequest(secondRequest).then(secondResponse =>{
                if(secondResponse){
                    blending(firstRequest,secondResponse,width,height).then(data =>{
                        console.log("process done")
                    })
                }      
         });
   }else{
    console.error("Firest request faild")
   }
});




  async function getFirstRequest(options){

    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)
        res.on('data', d => {
         return d;
        })
      })
      
      req.on('error', error => {
        console.error(error)
      })
      
      req.end()
  }

  async function getSecondrequest(options){

    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)
        res.on('data', d => {
         return d;
        })
      })
      
      req.on('error', error => {
        console.error(error)
      })
      
      req.end()
  }

  async function blending(firstResponse,secondResponse,width,height ){
     blend([
         {
             bufffer : new Buffer(firstResponse,'binary'),
             x:0,
             y:0

         },{
            bufffer : new Buffer(secondResponse,'binary'),
            x:width,
            y:0
         }],{
             width: width*2,
             height:height,
             format: 'jpeg'
         },(error,data)=>{
             const fileOut = join(process.cwd(),'/cat-card.jpg');
             console.log("File url"+fileOut);
             fs.writeFile('fileOut', data, err => {
                if (err) {
                  console.error(err)
                  return
                }
                console.log("File save success")
              })
         }
         )
  }

 