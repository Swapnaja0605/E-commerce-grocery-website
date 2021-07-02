var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var path = require('path');
var ejs = require('ejs');

app.set("view engine","ejs");
app.set('views',path.join(__dirname,'/views'));


app.use(bodyParser.urlencoded({extended:true}));
app.use(session({secret: 'Session Data '}));
app.use(bodyParser.json());

app.get("/",function(req,res){
   res.render("home");
});

// Registration
var conn = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: 'prognoz@1234',
   database: 'online_grocery'
});

conn.connect(function(error){
   if(!!error){
      console.log(error);
   }
   else{
      console.log("database connected");
   }
});

app.get("/signup", function (req, res) {
   let sql = "select * from user";
   let query = conn.query(sql,(err,rows)=>{
      if(err) throw err;
      res.render('signup');
   });
 });
   app.post("/signup", function (req, res) {
   var uname = req.body.uname;
   var email = req.body.email;
   var phn_no = req.body.phn_no;
   var password = req.body.password;
 
   conn.connect(function (err) {
     var sql =
       "insert into user(uname,email,phn_no,password)values('" +
       uname +
       "','" +
       email +
       "','" +
       phn_no +
       "','" +
       password +
       "')";
 
     conn.query(sql, function (err, result) {
       if (err) throw err;
       console.log("1 record inserted!");
       res.redirect("retrive");
     });
   });
 });

 //view records
 app.get('/retrive',function(req,res){
   var sql="select * from user";
   conn.query(sql,function(err,result){
     if(err)throw err;
     res.render('user_index',{
       users:result
     });
   });
 });

 //update record
 app.get("/test", function (req, res) {
   res.render("user_edit");
 });

app.post("/updatedata", function (req, res) {
   var uname = req.body.uname;
   var email = req.body.email;
   var phn_no = req.body.phn_no;
   var password = req.body.password;
   var uid = req.body.uid;
 
   conn.connect(function (err) {
      var sql =
        "update user set uname='" +
        uname +
        "',email='" +
        email +
        "',phn_no='" +
        phn_no +
        "',password='" +
        password +
        "' where uid='" +
        uid +
        "'";
 
     conn.query(sql, function (err, result) {
       if (err) throw err;
       console.log("1 record updated!");
       res.redirect("/test");
     });
   });
 });

 //Delete Account
 app.get("/test1", function (req, res) {
   res.render("user_delete");
 });
 
 app.post("/deleteData", function (req, res) {
   var uid = req.body.uid;
 
   conn.connect(function (err) {
     var sql = "delete from user where uid='" + uid + "'";
 
     conn.query(sql, function (err, result) {
       if (err) throw err;
       console.log("1 record deleted!");
       res.redirect("/test1");
     });
   });
 });
 



// signin
app.get("/test2",function(req, res){
   if(req.session.email){
      res.redirect("/admin");
   }
   else {
      res.render("signin");
   }
});

app.post("/signinData",function(req, res){
   req.session.email= req.session.email;
   req.session.password = req.session.password;
   res.end('Done');
});

app.get("/admin",function(req, res){
   if(req.session.email){
      res.write('<h1>Hello '+req.session.email+'</h1>');
      res.write('<a href="/logout">Logout</a>');
      res.end();
   }
   else{
      res.write('<h1>Please signin first</h1>');
      res.write('<a href="/test2">Signin</a>');
      res.end();
   }
});

app.get("/logout",function(req, res){
   req.session.destroy(function(err){
      if(err){
         console.log(err);
      }
      else{
         res.redirect('/test2');
      }
   });
});

app.listen(3000);
console.log('Server is connected at port 3000');