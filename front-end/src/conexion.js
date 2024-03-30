import axios from "axios";
import {useState } from "react";
import { Link, useNavigate } from "react-router-dom";


function Conexion(){
    const [errors, setErrors] =useState([]);
    const [email, setEmail] =useState("");
    const [password, setPassword] =useState("");
    const navigate = useNavigate();
    const http = axios.create({
      baseURL: "http://localhost:5000",
      headers: "Content-Type/apllication/json",
    });

    async function handlelogin(e) {
        e.preventDefault()
        const user = {
          "email":email,
          "password":password
        };
        const resp = await http.post("/conexion", user);
        if(resp.data.error){
            setErrors(resp.data);
        }else{
           localStorage.setItem('user',resp.data.token);
           navigate("/");
           window.location.reload(false); 
      }
      }

    return(
        <div className="container">
      <center>
        <form onSubmit={(e)=>{handlelogin(e)}} >
        <input type='email' className='form-control' id='email' placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} /><br />
        <input type='password' className='form-control' id='password' placeholder="Mot de passe"
          value={password} onChange={(e) => setPassword(e.target.value)} />
          <span>{errors?errors.error:""}</span><br/>
        <button id="connexion-button" type='submit' className='btn btn-outline-success me-1'>Se connecter</button>
          <Link className="text-dark" to="/Registrer"><button id="connexion-button" type='submit' className='btn btn-outline-primary'>Créer un compte</button></Link><br/>
      </form>
      </center>
    </div>
    );

}

export default Conexion;