const debug = require("./debug");
const env = require("./env");
const db = require("./database");
const uuid = require("uuid/v1")
const axios = require("axios")

//export db agnostic services
module.exports={
     follow: async(username, followsUserUsername)=>{
          let ret
          let userCheck = (await axios.get(env.baseUrl + '/account/' + username)).data;
          let followsUserCheck = (await axios.get(env.baseUrl + '/account/' + followsUserUsername)).data;
          if(userCheck && followsUserCheck){
               let out = await db.follow(username, followsUserUsername);
               debug.log(out);
               ret.status = env.statusOk;
          }else{
               ret.status = env.statusError;
          }
     },
     unfollow: async(username, unfollowsUserUsername)=>{
          let ret
          let userCheck = (await axios.get(env.baseUrl + '/account/' + username)).data;
          let unfollowsUserCheck = (await axios.get(env.baseUrl + '/account/' + unfollowsUserUsername)).data;
          if(userCheck && followsUserCheck){
               let out = await db.unfollow(username, unfollowsUserUsername);
               debug.log(out);
               ret.status = env.statusOk;
          }else{
               ret.status = env.statusError;
          }
     },
     getFollowers: async(username)=>{

     },
     getFollowing: async(username)=>{

     }
}
