const mongoose = require('mongoose');
const User = mongoose.model("UserService");
const env = require("./env");
const debug = require("./debug");



module.exports={
     getUserByUsername: async(username)=>{
          return await User.findOne({username: username})
     },



     follow: async(username, followsUserUsername)=>{
          let user = await User.findOne({username: username});
          let followsUser = await User.findOne({username: followsUserUsername});
          if(!user){
               let user = new User;
               user.username = user.username;
          }
          if(!followsUser){
               let followsUser = new User;
               followsUser.followsUserUsername = user.followsUserUsername;
          }
          user.follows.push(followsUserUsername);
          followsUser.followers.push(username)

          user.save();
          followsUser.save();


     },
     unfollow: async(username, unfollowsUser)=>{
          return await User.findOne({username: username})
     },

}
