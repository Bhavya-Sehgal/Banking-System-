
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/bankDB', {useNewUrlParser: true, useUnifiedTopology: true});

const customersSchema = {
  accountNo: String,
  name: String,
  email:String,
  currentBalance : Number
};

const Customer = mongoose.model('customer',customersSchema);

const cust1 = new Customer({
  accountNo: "1100 0000 2100",
  name: "Ekjot Kaur",
  email: "ek@gmail.com",
  currentBalance : 65000
});
const cust2 = new Customer({
  accountNo: "1100 0000 2101",
  name: "Nikhil Gupta",
  email: "ng@gmail.com",
  currentBalance : 55000
});
const cust3 = new Customer({
  accountNo: "1100 0000 2102",
  name: "Arpit Das",
  email: "ad@gmail.com",
  currentBalance : 85000
});
const cust4 = new Customer({
  accountNo: "1100 0000 2103",
  name: "Rishika Kanojia",
  email: "rk@gmail.com",
  currentBalance : 50000
});
const cust5 = new Customer({
  accountNo: "1100 0000 2104",
  name: "Vanya Arora",
  email: "va@gmail.com",
  currentBalance : 49000
});
const cust6 = new Customer({
  accountNo: "1100 0000 2105",
  name: "Anshul Chopra",
  email: "ac@gmail.com",
  currentBalance : 78000
});
const cust7 = new Customer({
  accountNo: "1100 0000 2106",
  name: "Manleen Kaur",
  email: "mk@gmail.com",
  currentBalance : 57000
});
const cust8 = new Customer({
  accountNo: "1100 0000 2107",
  name: "Atharv Sharma",
  email: "as@gmail.com",
  currentBalance : 30000
});
const cust9 = new Customer({
  accountNo: "1100 0000 2108",
  name: "Saksham Chopra",
  email: "sc@gmail.com",
  currentBalance : 77000
});
const cust10 = new Customer({
  accountNo: "1100 0000 2109",
  name: "Sahil Sehgal",
  email: "ss@gmail.com",
  currentBalance : 95000
});

const allCustomers = [cust1,cust2,cust3,cust4,cust5,cust6,cust7,cust8,cust9,cust10];


app.get("/Customers",function(req,res){

    Customer.find({},function(err,customers){
      if(customers.length === 0){
        Customer.insertMany(allCustomers,function(err){
          if(err){
            console.log(err);
          } else {
            console.log("Successfully added 10 customers");
          }
        });

      }
      res.render("customers",{customerdetails : customers});

    });

});

app.get("/",function(req,res){
  res.render("home");
});

app.get("/transfers",function(req,res){
  res.render("transfers");
});

app.get("/deposit",function(req,res){
  res.render("deposit");
});

app.get("/withdraw",function(req,res){
  res.render("withdraw");
});

app.get("/userprofile/:customerName",function(req,res){
  const customerName = req.params.customerName;
  Customer.findOne({name:customerName},function(err,customer){
    if(!err){
      res.render("userprofile",{foundCustomer:customer})
    }
    else{
      console.log(err);
    }
  });

});

app.get("/success",function(req,res){
  res.render("success");
});

app.get("/failure",function(req,res){
  res.render("failure");
});

app.post("/deposit",(req,res)=>{
  console.log(req.body);
  const depositAccountNo = req.body.depositAccount;
  const depositMoney = req.body.depositAmount;
  Customer.findOneAndUpdate({accountNo : depositAccountNo}, {$inc: {currentBalance : depositMoney}})
  .then(updatedValue=>{
    console.log("Money Deposited Successfully");
    res.redirect("/success");
  })
  .catch(err=>{
    console.log(err);
    res.redirect("/failure");
  });
 });

app.post("/withdraw",(req,res)=>{
  console.log(req.body);
  const withdrawAccountNo = req.body.withdrawAccount;
  const withdrawMoney = req.body.withdrawAmount;
    Customer.findOneAndUpdate({accountNo : withdrawAccountNo}, {$inc: {currentBalance : - withdrawMoney}}, (error,response)=>{
      if(!error){
             console.log("Money Withdrawn Successfully");
             res.redirect("/success");
             //console.log(res);
           }
      else{
             console.log(error);
             res.redirect("/failure");
           }
         });

});

app.post("/transfers",(req,res)=>{
  console.log(req.body);
  const fromTransfer = req.body.fromAccount;
  const toTransfer = req.body.toAccount;
  const amount = req.body.amount;
  if(fromTransfer===toTransfer){
    res.redirect("/failure");
  }
  else{
    Customer.findOneAndUpdate({accountNo : fromTransfer}, {$inc: {currentBalance : - amount}}, (err,res)=>{
      if(!err){
             console.log("Updated Successfully- fromAccount");
             //console.log(res);
           }
           else{
             console.log(err);
           }
         });

    Customer.findOneAndUpdate({accountNo : toTransfer}, {$inc: {currentBalance : amount}}, (err,res)=>{
      if(!err){
             console.log("Updated Successfully- toAccount");
             //console.log(res);
           }
           else{
             console.log(err);
           }
         });
         res.redirect("/success");

  }

 });

 app.post("/userprofile/:customerName",(req,res)=>{
   const deleteProfile = req.body.deleteAccount;
   // console.log(deleteProfile);
   Customer.deleteOne({accountNo: deleteProfile},(err,res)=>{
     if(!err){
       console.log("Deleted Customer Successfully");
     }
     else{
       console.log(err);
     }
   });
   res.redirect("/customers");
 });

 app.post("/Customers",(req,res)=>{
   const custNew = new Customer({
     accountNo: req.body.Account,
     name: req.body.AccountName,
     email: req.body.AccountEmail,
     currentBalance : req.body.AccountBalance
   });

   custNew.save();

   res.redirect("/customers");
 });

app.listen(3000,function(){
  console.log("Server started at port 3000");
});
