import { Navigate, Route, Routes } from "react-router-dom";
import Registrer from "./registrer";
import Conexion from "./conexion";
import Dashbord from "./dashbord";
import Layout from "./layout";
import Commentlist from "./commentlist";
import { useEffect, useState } from "react";
import Profil from "./profil";
import Freindlist from "./freindlist";
import Check from "./check";
import Parametre from "./parametre";
import Updateinfo from "./updateinfo";


function App() {
  const [user,setUser]=useState();
  useEffect(()=>{
    const users =localStorage.getItem('user');
    if(users){
    setUser(users);
    }
},[])

  return (
    
    <Routes>
      <Route element={<Layout/>}>
      <Route path="/" element={user?<Dashbord/>:<Navigate to="/Conexion"></Navigate>}></Route>
        <Route path="Comment/:id" element={user?<Commentlist/>:<Navigate to="/Conexion"></Navigate>}></Route>
        <Route path="Freindlist/:id" element={user?<Freindlist/>:<Navigate to="/Conexion"></Navigate>}></Route>
        <Route path="Conexion" element={!user?<Conexion/>:<Navigate to="/"></Navigate>}></Route>
        <Route path="Profil/:id" element={user?<Profil/>:<Navigate to="/Conexion"></Navigate>}></Route>
        <Route path="Check/:id" element={user?<Check/>:<Navigate to="/Conexion"></Navigate>}></Route>
        <Route path="Parametre/:id" element={user?<Parametre/>:<Navigate to="/Conexion"></Navigate>}></Route>
        <Route path="Modifier-info/:id" element={user?<Updateinfo/>:<Navigate to="/Conexion"></Navigate>}></Route>
        <Route path="Registrer" element={!user?<Registrer/>:<Navigate to="/"></Navigate>}></Route>
      </Route>
    </Routes>
    
  );
}

export default App;
