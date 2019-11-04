
module.exports={
     statusOk: {"status": "OK"},
     statusError: {"status":"ERROR"},
     baseUrl: "http://hackguy.cse356.compas.cs.stonybrook.edu",
     mongoUrlProd: "mongodb://130.245.170.213:27017/docker-node-mongo",
     mongoUrl: ()=>{
          if(process.argv.includes("-d")){
               return "mongodb://mongo:27017/docker-node-mongo"
          }else if(process.argv.includes("-stage")){
               return "mongodb://130.245.170.213:27017/docker-node-mongo"
          }else{
               return "mongodb://192.168.122.25:27017/docker-node-mongo"
          }
     }
}
