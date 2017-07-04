"use strict";var _authentication_controller=require("./authentication/authentication_controller"),_donor_controller=require("./donor/donor_controller"),_receiver_controller=require("./receiver/receiver_controller"),express=require("express"),session=require("express-session"),pg=require("pg"),http=require("http"),bodyParser=require("body-parser"),path=require("path"),connectionPool=require("./database_help/connection_pool"),app=express(),clientBuildDir=__dirname+"/../../client/dist/";require("dotenv").config({path:__dirname+"/../../.env"}),app.set("port",process.env.NODE_PORT||5e3),app.use(express.static(clientBuildDir)),app.use(bodyParser.json()),app.use(session({secret:"xefbwefiefw",cookie:{maxAge:6e4},resave:!1,saveUninitialized:!1}));var authenticationController=new _authentication_controller.AuthenticationController,donorController=new _donor_controller.DonorController,receeverController=new _receiver_controller.ReceiverController;app.get("/db",function(e,r){connectionPool.connect().then(function(e){e.query("SELECT * FROM test_table;",function(e,o){e?(console.error(e),r.send("Error "+e)):r.send({results:o.rows})}),e.query("SELECT * FROM test_table;").then(function(r){e.done(),console.log(r.rows[0])}).catch(function(o){e.done(),console.error("query error",o.message,o.stack),r.send("Error "+o)})}).catch(function(e){console.error("query error",e.message,e.stack),r.send("Error "+e)})}),app.post("/authentication/login",authenticationController.login.bind(authenticationController)),app.get("*",function(e,r){console.log(process.env.DATABASE_URL),r.sendFile(path.join(clientBuildDir+"/index.html"))}),app.listen(app.get("port"),function(){console.log("Node app is running on port",app.get("port"))});
//# sourceMappingURL=server.js.map
