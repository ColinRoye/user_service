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
     debug.log("INPUT: /user/:username/followers " + JSON.stringify(req.params))
     res.send(await services.getFollowers(req.params.username,req.body));
});
router.get('/user/:username/following', async (req, res, next)=>{
     debug.log("INPUT: /user/:username/following: " + JSON.stringify(req.params))
     res.send(await service.getFollowing(req.params.username,req.body));
});
router.get('/user/:username', async (req, res, next)=>{
     debug.log("INPUT: /user/:username: " + JSON.stringify(req.params))
     let ret = {}
     debug.log("USER/:USERNAME ROUTE: " + req.params.email)
     let email = (await axios.get(env.baseUrl + '/account/' + req.params.username)).data;

     if(email !== ""){
          debug.log("USER/:USERNAME ROUTE: EMAIL" + email)

          let user = await service.getUserByUsername(req.params.username);
          if(user === null){
               user = await service.addUser(req.params.username)
          }

          debug.log("USER/:USERNAME ROUTE: USER" + user)
          if(user.followers && user.following){
               ret.user = {
                    "followers": user.followers.length ,
                    "following": user.following.length ,
                    "email": email
               }

          }else{
               ret.user = {
                    "followers": 0,
                    "following": 0,
                    "email": email
               }
          }

          ret.status = env.statusOk;
          debug.log(ret);
          debug.log("OUTPUT: " + JSON.stringify(ret))

          res.send(JSON.stringify(ret));
     }else{
          ret.status = env.statusError;
          ret.error = "USER DNE"
          debug.log(ret);
          res.send(ret)
     }


});
router.get('/user/:username/posts', async (req, res, next)=>{
     debug.log("INPUT: /user/:username/posts" + JSON.stringify(req.params))

     let body = {limit: 1}
     res.send((await getPosts(req.params.username,body.limit)).data);
});


router.post('/follow', async (req, res, next)=>{
     debug.log("INPUT: /follow" + JSON.stringify(req.params))

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
