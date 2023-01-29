//jshint esversion:6
require('dotenv').config()
//console.log(process.env)
const express= require("express");
const mongoose=require("mongoose");
const bodyParser= require("body-parser");
const ejs=require("ejs");
const exp = require("constants");
const encrypt= require("mongoose-encryption");

const app=express();

app.use(express.static("pubic"));

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/secretuserdb");

const usershema= new mongoose.Schema({
    email:String,
    password:String
});


usershema.plugin(encrypt, { secret:process.env.SECRET, encryptedFields:['password'] });

const user= mongoose.model("user",usershema);



app.listen("3000",function(req,res){
    console.log("port running on port:3000");
});

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;

    user.findOne({email:username},function(err,found){
        if(!err){
            if(found){
                if(found.password===password){
                    res.render("secrets");
                }
            }
        }
        else{
            console.log(err);
        }
    });
});


app.post("/register",function(req,res){
    const newuser= new user({
        email:req.body.username,
        password:req.body.password
    });
  
    run();
    async function run(){
        await newuser.save(function(err){
            if(!err){
                res.render("secrets");
            }
            else{
                console.log(err);
            }
        })
    }
});

