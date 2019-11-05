const mongoose = require('mongoose');
const User = mongoose.model("UserService");
const env = require("./env");
const debug = require("./debug");



module.exports={
     getUserByUsername: async(username)=>{
          return await User.findOne({username: username})
     },
     addUser: async(username)=>{
          let user = new User;
          user.username = username;
          user.followers = [];
          user.following = [];
          await user.save();
          return user
     },


     follow: async(username, followsUserUsername)=>{
          debug.log("FOLLOW_DATABASE: top")
          let user = await User.findOne({username: username});
          let followsUser = await User.findOne({username: followsUserUsername});
          if(!user){
               debug.log("FOLLOW_DATABASE: user NOT defined")
               user = new User;
               user.username = username;
               user.followers = [];
               user.following = [];
               debug.log("FOLLOW_DATABASE: user is defined to " + JSON.stringify(user))


          }
          if(!followsUser){
               debug.log("FOLLOW_DATABASE: followUser NOT defined")
               followsUser = new User;
               followsUser.followsUserUsername = followsUserUsername;
               followsUser.followers = [];
               followsUser.following = [];
          }


          user.following.push(followsUserUsername);
          followsUser.followers.push(username)

          debug.log("FOLLOW_DATABASE: User follows array" + user.follows)
          debug.log("FOLLOW_DATABASE: User follows array" + followsUser.following)



          await user.save();
          await followsUser.save();

          return "ok";


     },
     unfollow: async(username, unfollowsUser)=>{
          return await User.findOne({username: username})
     },

}
