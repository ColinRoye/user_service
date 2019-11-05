const express = require("express");
const app = express();
const router = require("express").Router();
const debug = require("./debug");
const env = require("./env");
const auth = require("./auth");
const service = require("./services");
const axios = require("axios");



//followers

//user_db
// let getFollowers = async(username, body)=>{return await axios.get(env.dbUrl + '/user/' + username + '/followers', body)}
// let getFollowing = async(username, body)=>{return await axios.get(env.dbUrl + '/user/' + username + '/following', body)}
//let follow =       async(username, body)=>{return await axios.post(env.dbUrl + '/follow'), body)}

//item_db
let getPosts =      async(username, limit)=>{
     let url = env.baseUrl + "/items/" + username
     console.log(url)
     return axios.get(url, {
          params: {
               limit:limit
          }
  })
}


router.get('/user/:username/followers', async (req, res, next)=>{
     res.send(await services.getFollowers(req.params.username,req.body));
});
router.get('/user/:username/following', async (req, res, next)=>{
     res.send(await service.getFollowing(req.params.username,req.body));
});
router.get('/user/:username', async (req, res, next)=>{
     debug.log("INPUT: " + JSON.stringify(req.params))
     let ret = {}
     debug.log("USER/:USERNAME ROUTE: " + req.params.email)

     if(ret.email !== ""){
          ret.email = (await axios.get(env.baseUrl + '/account/' + req.params.username)).data;
          debug.log("USER/:USERNAME ROUTE: EMAIL" + ret.email)

          let user = await service.getUserByUsername(req.params.username);
          if(user === null){
               user = await service.addUser(req.params.username)
          }

          debug.log("USER/:USERNAME ROUTE: USER" + user)
          if(user.followers && user.following){
               ret.followers = user.followers.length
               ret.following = user.following.length
          }else{
               ret.followers = "0";
               ret.following = "0";
          }

          ret.status = env.statusOk;
          debug.log(ret);
          debug.log("OUTPUT: " + JSON.stringify(ret))

          res.send(ret);
     }else{
          ret.status = env.statusError;
          debug.log(ret);
          res.send(ret)
     }


});
router.get('/user/:username/posts', async (req, res, next)=>{

     let body = {limit: 1}
     res.send((await getPosts(req.params.username,body.limit)).data);
});


router.post('/follow', async (req, res, next)=>{
     debug.log("FOLLOW_ROUTE: top")
     let args = req.body;
     let ret = {};
     let user = req.cookies['auth'];
     let followUser = args.username;
     if(user){
          if(args.follow === undefined || args.follow === "true"){
               debug.log("FOLLOW_ROUTE: FOLLOW")
               ret = service.follow(user, followUser);
          }else{
               debug.log("FOLLOW_ROUTE: UNFOLLOWING")
               ret = service.unfollow(user, followUser);
          }
     }else{
          debug.log("FOLLOW_ROUTE: user undefined")

          ret.status = env.statusError;
     }
     res.send(ret)

});



module.exports = router
