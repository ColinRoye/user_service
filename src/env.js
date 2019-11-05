
module.exports={
     statusOk: "OK",
     statusError: "error",
     baseUrl: "http://hackguy.cse356.compas.cs.stonybrook.edu",
     mongoUrlProd: "mongodb://130.245.170.213:27017/docker-node-mongo",
     mongoUrl: ()=>{
          if(process.argv.includes("-d")){
               return "mongodb://mongo:27017/docker-node-mongo2"
          }else if(process.argv.includes("-stage")){
               return "mongodb://130.245.170.213:27017/docker-node-mongo2"
          }else{
               return "mongodb://192.168.122.25:27017/docker-node-mongo2"
          }
     }
}
