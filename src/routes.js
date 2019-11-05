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
     //if(!Number.isInteger(limit)){limit = ''}
     if(!limit){
          limit = 50
     }
     if(limit > 200){
          limit = 200;
     }
     debug.log("FUCK : " +  env.baseUrl + "/items/" + username + "/" + limit)

     let url = env.baseUrl + "/items/" + username + "/" + limit
     debug.log("LIMIT IN GET POSTS: " + limit);
     return axios.get(url);
}


router.get('/user/:username/followers', async (req, res, next)=>{
     debug.log("INPUT: /user/:username/followers " + JSON.stringify(req.params))
     //debug.log(JSON.stringify(await service.getUserByEmail("c@c.cccccccc")))
     let followers = (await service.getUserByEmail(await req.params.username)).followers;
     let temp = [];
     if(req.query.limit == undefined){
          req.query.limit = 50
     }
     if(req.query.limit > 200){
          req.query.limit = 200
     }
     for(let i = 0; i < req.query.limit;i++){
          temp.push(followers[i]);
     }
     res.send({users: temp, status:"OK"})
});
router.get('/user/:username/following', async (req, res, next)=>{
     debug.log("INPUT: /user/:username/followers " + JSON.stringify(req.params))
     //debug.log(JSON.stringify(await service.getUserByEmail("c@c.cccccccc")))
     let following = (await service.getUserByEmail(await req.params.username)).following;
     let temp = [];
     if(req.query.limit == undefined){
          req.query.limit = 50
     }
     if(req.query.limit > 200){
          req.query.limit = 200
     }
     for(let i = 0; i < req.query.limit;i++){
          temp.push(following[i]);
     }
     res.send({users: temp, status:"OK"})
});
router.get('/user/:username', async (req, res, next)=>{
     debug.log("INPUT: /user/:username: " + JSON.stringify(req.params))
     let ret = {}
     debug.log("USER/:USERNAME ROUTE: " + req.params.email)
     let email = (await axios.get(env.baseUrl + '/account/' + req.params.username)).data;
     debug.log("email" + email)

     if(email !== ""){
          debug.log("USER/:USERNAME ROUTE: EMAIL" + email)

          let user = await service.getUserByEmail(email);
          if(user === null){
               user = await service.addUser(email)
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
     debug.log("LIMIT: " + req.query.limit)
     res.send((await getPosts(req.params.username,req.query.limit)).data);
});


router.post('/follow', async (req, res, next)=>{
     debug.log("INPUT: FOLLOW_ROUTE: /follow" + JSON.stringify(req.body))

     debug.log("FOLLOW_ROUTE: top")
     let args = req.body;
     let ret = {};
     let user = req.cookies['auth'];
     let followUser = args.username;
     if(user){
          debug.log("FOLLOW_ROUTE: args.follow === undefined " + args.follow === undefined);
          debug.log("FOLLOW_ROUTE: args.follow === true " + args.follow === true);
          debug.log("FOLLOW_ROUTE: args.follow"+args.follow);

          if(args.follow === undefined || args.follow === true){
               debug.log("FOLLOW_ROUTE: FOLLOW")
               ret = await service.follow(user, followUser);
          }else{
               debug.log("FOLLOW_ROUTE: UNFOLLOWING")
               ret = await service.unfollow(user, followUser);
          }
     }else{
          debug.log("FOLLOW_ROUTE: user undefined")

          ret.status = env.statusError;
     }
     res.send(ret)

});



module.exports = router
