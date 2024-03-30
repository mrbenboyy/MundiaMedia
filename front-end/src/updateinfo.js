import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Updateinfo() {
    const navigete = useNavigate();
    const param = useParams();
    const [user, setUser] = useState();
    const [input, setInput] = useState("");
    const [user_token, setUser_token] = useState({});
    const [infoupdate, setInfoupdate] = useState();
    var http;

    if (user_token) {
        http = axios.create({
            baseURL: "http://localhost:5000",
            headers: {
                "Content-Type": "apllication/json",
                'Authorization': `Bearer ${user_token}`,
            },
        });
    };
    useEffect(() => {
        const users = localStorage.getItem('user');
        if (users) {
            setUser_token(users);
        };
    }, []);

    useEffect(() => {
        info();
    })


    async function info() {

        if (param.id) {
            const resp = await http.get("/dashbord/info/" + param.id);
            setUser(resp.data);
        }
    }
    async function modifier(e, info) {
        e.preventDefault();
        if (param.id) {
            if (infoupdate) {
                if (info === "imageprofil") {
                    const formdata = new FormData();
                    formdata.append("imageprofil", infoupdate);
                    const resp = await http.post("/dashbord/modifier-info/" + param.id + "/" + infoupdate.name + "/" + info, formdata);
                    setUser(resp.data);
                } else {
                    const resp = await http.post("/dashbord/modifier-info/" + param.id + "/" + infoupdate + "/" + info);
                    setUser(resp.data);
                }

            }
        };
        setInput("");
    }
    return (
        <div>
            <button id="back-button" className="btn text-white" onClick={() => navigete(-1)}>back</button><br />
            <center>
                {user ? <div>
                    {input === "imageprofil" ? <div><input className="update-input form-control" type="file" id="imageprofil" onChange={(e) => setInfoupdate(e.target.files[0])}></input><br/><button className="btn btn-outline-success" onClick={(e) => modifier(e, "imageprofil")}>Enregistrer</button></div> : <div><img src={"/images/imagesprofil/" + user.imageprofil} alt="logo" style={{ width: "250px" }} className="rounded-circle" /><br/><br/><br/><button className="btn btn-outline-primary" onClick={() => setInput("imageprofil")}>Modifier</button></div>}<br />
                    {input === "nomprofil" ? <div><input className="update-input" value={infoupdate} placeholder="Nom complet" type="text" id="nomprofil" onChange={(e) => setInfoupdate(e.target.value)}></input><button onClick={(e) => modifier(e, "nomprofil")} className="btn btn-outline-success ms-2">Enregistrer</button></div> : <div>{user.nomprofil}<br/><br/><button className="btn btn-outline-primary" onClick={() => setInput("nomprofil")}>Modifier</button></div>} <br />
                    {input === "telefon" ? <div><input className="update-input" placeholder="Numéro de télephone" type="text" id="telefon" onChange={(e) => setInfoupdate(e.target.value)}></input><button onClick={(e) => modifier(e, "telefon")} className="btn btn-outline-success ms-2">Enregistrer</button></div> : <div>{user.telefon}<br/><br/><button className="btn btn-outline-primary" onClick={() => setInput("telefon")}>Modifier</button></div>} <br />
                    {input === "datenaissance" ? <div><input className="update-input" type="date" id="datenaissance" onChange={(e) => setInfoupdate(e.target.value)}></input><button onClick={(e) => modifier(e, "datenaissance")} className="btn btn-outline-success ms-2">Enregistrer</button></div> : <div>{new Date(user.datenaissance).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}<br/><br/><button onClick={() => setInput("datenaissance")} className="btn btn-outline-primary">Modifier</button></div>} <br />
                    {input === "email" ? <div><input className="update-input" type="email" id="email" onChange={(e) => setInfoupdate(e.target.value)}></input><button onClick={(e) => modifier(e, "email")} className="btn btn-outline-success ms-2">Enregistrer</button></div> : <div>{user.email}<br/><br/><button className="btn btn-outline-primary" onClick={() => setInput("email")}>Modifier</button></div>} <br/>
                    <label htmlFor='password' className='form-label'>Changer mot de passe:</label>{input === "password" ? <div><input className="update-input" type="password" id="password" onChange={(e) => setInfoupdate(e.target.value)}></input><button onClick={(e) => modifier(e, "password")} className="btn btn-outline-success ms-2">Enregistrer</button></div> : <div><button className="btn btn-outline-primary" onClick={() => setInput("password")}>Modifier</button></div>}
                </div> : ""}
            </center>
        </div>
    );
}

export default Updateinfo;