const mongoose = require('mongoose');
const User = mongoose.model("UserService");
const env = require("./env");
const debug = require("./debug");



module.exports={
     getUserByEmail: async(email)=>{
          return await User.findOne({email: email})
     },
     addUser: async(username)=>{
          let user = new User;
          user.username = username;
          user.followers = [];
          user.following = [];
          await user.save();
          return user
     },



     follow: async(username, userEmail, followname, followsUserEmail)=>{
          debug.log("FOLLOW_DATABASE: top")
          debug.log("FOLLOW_DATABASE: userEmail "+userEmail)
          debug.log("FOLLOW_DATABASE: username "+username)
          debug.log("FOLLOW_DATABASE: followsUserEmail "+followsUserEmail)
          debug.log("FOLLOW_DATABASE: followname "+followname)


          let user = await User.findOne({email: userEmail});
          let followsUser = await User.findOne({email: followsUserEmail});

          if(!user){
               debug.log("FOLLOW_DATABASE: user NOT defined")
               user = new User;
               user.email = userEmail;
               user.followers = [];
               user.following = [];
               debug.log("FOLLOW_DATABASE: user is defined to " + JSON.stringify(user))
               await user.save();


          }
          if(!followsUser){
               debug.log("FOLLOW_DATABASE: followUser NOT defined")
               followsUser = new User;
               followsUser.email = followsUserEmail;
               followsUser.followers = [];
               followsUser.following = [];
               await followsUser.save();

          }

          user.following.push(followname);
          followsUser.following.push(username);


          debug.log("FOLLOW_DATABASE: User follows array" + user.follows)
          debug.log("FOLLOW_DATABASE: User follows array" + followsUser.following)

          // await User.updateOne({email:userEmail}, {$push:{'following': followname}})
          // await User.updateOne({email:followsUser}, {$push:{'followers': username}})

          await followsUser.save();
          await user.save();
          return "ok";


     },
     unfollow: async(username, userEmail, followname, followsUserEmail)=>{
          debug.log("FOLLOW_DATABASE: top")
          debug.log("FOLLOW_DATABASE: userEmail "+userEmail)
          debug.log("FOLLOW_DATABASE: username "+username)
          debug.log("FOLLOW_DATABASE: followsUserEmail "+followsUserEmail)
          debug.log("FOLLOW_DATABASE: followname "+followname)


          let user = await User.findOne({email: userEmail});
          let followsUser = await User.findOne({email: followsUserEmail});

          if(!user){
               debug.log("FOLLOW_DATABASE: user NOT defined")
               user = new User;
               user.email = userEmail;
               user.followers = [];
               user.following = [];
               debug.log("FOLLOW_DATABASE: user is defined to " + JSON.stringify(user))
               await user.save();


          }
          if(!followsUser){
               debug.log("FOLLOW_DATABASE: followUser NOT defined")
               followsUser = new User;
               followsUser.email = followsUserEmail;
               followsUser.followers = [];
               followsUser.following = [];
               await followsUser.save();

          }

          user.following = user.following.filter((elm)=>{return elm != followname})
          followsUser.following = followsUser.following.filter((elm)=>{return elm != username})


          debug.log("FOLLOW_DATABASE: User follows array" + user.follows)
          debug.log("FOLLOW_DATABASE: User follows array" + followsUser.following)

          await User.updateOne({email:userEmail}, {$set:{'following': followname}})
          await User.updateOne({email:followsUser}, {$set:{'followers': username}})

     
          return "ok";     },

}
