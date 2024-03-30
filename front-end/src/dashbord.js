import axios from "axios";
import Post from "./post";
import { useEffect, useState } from "react";
import Amie from "./amie";
function Dashbord(){
const [user_token,setUser_token]=useState({});
const [user,setUser]=useState();
var http;
useEffect(()=>{
    const users =localStorage.getItem('user');
    if(users){
        setUser_token(users);
         Utilisateur();
    }
   
},[user_token]);

if(user_token){
    http = axios.create({
        baseURL: "http://localhost:5000",
        headers:{ "Content-Type":"apllication/json",
         'Authorization':`Bearer ${user_token}`,
        },
});};

async function Utilisateur(){
    const resp = await http.get('/dashbord');
    setUser(resp.data);

}
return(
<div style={{ display: 'flex' }}>
  <div style={{ flex: '2' }}>
    <Post user={user ? user : ""}></Post>
  </div>
  <div style={{ flex: '1' }}>
    <Amie user={user ? user : ""}></Amie>
  </div>
</div>

);

};

export default Dashbord;