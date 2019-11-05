const debug = require("./debug");
const env = require("./env");
const db = require("./database");
const uuid = require("uuid/v1")
const axios = require("axios")

//export db agnostic services
module.exports={
     addUser: async(username)=>{
          return await db.addUser(username);
     },
     follow: async(username, followsUserUsername)=>{
          debug.log("FOLLOW_SERVICE: TOP")
          debug.log("FOLLOW_SERVICE: USERNAME " + username)
          debug.log("FOLLOW_SERVICE: USERNAME " + followsUserUsername)

          let ret = {};
          let userCheck = (await axios.get(env.baseUrl + '/account/' + username)).data;
          debug.log("FOLLOW_SERVICE: USERCHECK " + userCheck);
          let followsUserCheck = (await axios.get(env.baseUrl + '/account/' + followsUserUsername)).data;
          debug.log("FOLLOW_SERVICE: FOLLOWUSERCHECK " + followsUserCheck);

          if(userCheck && followsUserCheck){
               debug.log("FOLLOW_SERVICE: BOTH USERS EXIST")

               let out = await db.follow(username, followsUserUsername);
               debug.log(out);
               ret.status = env.statusOk;
          }else{
               if(userCheck){
                    debug.log("FOLLOW_SERVICE: ERROR user exists, but followUser does not")
               }else{
                    debug.log("FOLLOW_SERVICE: ERROR followUser exists, but user does not")

               }
               ret.status = env.statusError;
          }
          return ret;
     },
     unfollow: async(username, unfollowsUserUsername)=>{
          let ret
          let userCheck = (await axios.get(env.baseUrl + '/account/' + username)).data;
          let unfollowsUserCheck = (await axios.get(env.baseUrl + '/account/' + unfollowsUserUsername)).data;
          if(userCheck && unfollowsUserCheck){
               let out = await db.unfollow(username, unfollowsUserUsername);
               debug.log(out);
               ret.status = env.statusOk;
          }else{
               ret.status = env.statusError;
          }
          return ret;
     },
     getUserByUsername: async(username)=>{
          return await db.getUserByUsername(username)
     },
     getFollowers: async(username)=>{

     },
     getFollowing: async(username)=>{

     }
}
