import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Registrer() {
  const [errors, setErrors] = useState([]);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telefon, setTelefon] = useState("");
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageprofil, setImageprofil] = useState("");
  const navigate = useNavigate();
  const http = axios.create({
    baseURL: "http://localhost:5000",
    headers: "Content-Type/apllication/json",
  });

  async function handleregistrer(e) {
    e.preventDefault()
    const formdata = new FormData();
    formdata.append("nom", nom);
    formdata.append("prenom", prenom);
    formdata.append("telefon", telefon);
    formdata.append("datenaissance", date);
    formdata.append("imageprofil", imageprofil);
    formdata.append("email", email);
    formdata.append("password", password);

    const resp = await http.post("/inscription", formdata);
    if (resp.data.error) {
      setErrors(resp.data);
    } else {
      navigate("/conexion");
    }
  }
  return (
    <div className="container">
      <center>
        <form onSubmit={(e) => { handleregistrer(e) }} encType="multipart/form-data">
          <input type='text' id='nom' className='form-control' placeholder="Nom"
            onChange={(e) => setNom(e.target.value)} /><br/>
          <input type='text' className='form-control' id='prenom' placeholder="Prénom"
            onChange={(e) => setPrenom(e.target.value)} /><br />
          <input type='text' className='form-control' id='telefon' placeholder="Numéro de télephone"
            onChange={(e) => setTelefon(e.target.value)} /><br />
          <input type='date' className='form-control' id='datenaissance'
            onChange={(e) => setDate(e.target.value)} /><br />
          <input type='file' className='form-control' id='imageprofil'
            onChange={(e) => setImageprofil(e.target.files[0])} /><br />
          <input type="email" className='form-control' id='email' placeholder="Email"
            onChange={(e) => setEmail(e.target.value)} /><br />
          <input type='password' className='form-control' id='password' placeholder="Mot de passe"
            onChange={(e) => setPassword(e.target.value)} />
          <span>{errors ? errors.error : ""}</span><br />
          <button id="inscription-button" type='submit' className='btn btn-outline-success me-md-2'>S'inscrire</button>
        </form>
      </center>
    </div>
  );
}

export default Registrer;