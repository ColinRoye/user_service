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
     res.send(await services.getFollowing(req.params.username,req.body));
});
router.get('/user/:username', async (req, res, next)=>{
     let email = (await axios.get(env.baseUrl + '/account/' + req.params.username)).data;
     // let followers = await services.getFollowers(req.params.username,req.body)
     // let following = await services.getFollowing(req.params.username,req.body)
     res.send(email);

});
router.get('/user/:username/posts', async (req, res, next)=>{

     let body = {limit: 1}
     res.send((await getPosts(req.params.username,body.limit)).data);
});


router.post('/follow', async (req, res, next)=>{
     res.send(follow(req.params.username,req.body));
});



module.exports = router
