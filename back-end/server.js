const express = require("express");
const app =express();
const mongoose=require("mongoose");
const cors=require("cors");
const dotenv=require("dotenv");
const userroute = require("./routes/user-router");
const dashbordroute = require("./routes/dashbord-router");
dotenv.config();
app.use(cors());
app.use(express.json());
const url = process.env.base_url;
app.use("/",userroute);
app.use("/dashbord",dashbordroute);
mongoose.connect(url).then(result=>app.listen(process.env.port,()=>{
    console.log("connected");})).catch(error=>console.log(error));