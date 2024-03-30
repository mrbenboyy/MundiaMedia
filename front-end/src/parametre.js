import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function Parametre(){
    const navigete = useNavigate();
    const param = useParams();
    const [user_token,setUser_token]=useState({});
    const [errors,setErrors]=useState({});
    var http;

    if(user_token){
      http = axios.create({
          baseURL: "http://localhost:5000",
          headers:{ "Content-Type":"apllication/json",
           'Authorization':`Bearer ${user_token}`,
          },
  });};
    useEffect(()=>{
      const users =localStorage.getItem('user');
      if(users){
          setUser_token(users);
      };
  },[]);
  async function deletecompte(e){
    e.preventDefault();
    if(param.id){
        const resp = await http.delete("/dashbord/supprimer-compte/"+param.id);
        if(resp.data.error){
            setErrors(resp.data);
        }else{
            localStorage.removeItem('user');
            window.location.reload(false);
        }
    }
  }
return(
    <div>
        <button id="params-buttons" className="btn btn-outline-primary" onClick={()=>navigete(-2)}>back</button><br/>
        <Link className="text-decoration-none " to={`/Modifier-info/${param.id}`}><button id="params-buttons" className="btn btn-outline-success">Modifier les information de votre compte</button></Link><br/>
        <button id="params-buttons" className="btn btn-outline-danger" onClick={(e)=>deletecompte(e)}>Supprimer le compte</button>
    </div>
);
}

export default Parametre;