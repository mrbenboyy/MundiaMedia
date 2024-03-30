import axios from "axios";
import { useEffect, useState } from "react";
import "./style2.css";
import { Link } from "react-router-dom";

function Amie(props) {
  const [user_token, setUser_token] = useState({});
  const [userslist, setUserslist] = useState([]);
  const [freinds, setFreinds] = useState([]);
  const [search,setSearch]=useState("");

  var http;

  if (user_token) {
    http = axios.create({
      baseURL: "http://localhost:5000",
      headers: {
        "Content-Type": "application/json",  // Fix typo here
        'Authorization': `Bearer ${user_token}`,
      },
    });
  }

  useEffect(() => {
    const idusers = localStorage.getItem('user');
    if (idusers) {
      setUser_token(idusers);
    }
  }, [user_token]);

  useEffect(() => {
    listusers();
  });

  async function listusers() {
    if(props.user){
      const resp = await http.get("/dashbord/users");
      setUserslist(resp.data.user);
      setFreinds(resp.data.freind);
    }
  }
  async function ajouteramie(elm,id,action){
    elm.preventDefault();
    console.log(id);
    const resp = await http.patch("/dashbord/amie/"+id+"/"+action);
    setFreinds(resp.data);
  }

  return (
    <div><br/>
      <div className="container">
      <input  type="text" className="form-control"  id="search" onChange={(e)=>setSearch(e.target.value)} placeholder="Chercher un utilisateur..." />
      </div>
      {userslist && userslist.filter((e) => {
        if(search === ""){
          return e
        }else if(e.nomprofil.includes(search.toLowerCase())){
          return e;
        }
      }).map((e,i) => (
       <>
        {!(freinds.freindlist.includes(e._id))?<div key={i}>
        <div className="card" id="searched-card">
          <div className="top">
          <Link className="text-decoration-none text-dark"  to={`/Profil/${e._id}`}>
            <div className="info">
              <img id="friend-image-card" src={"/images/imagesprofil/" + e.imageprofil} alt="" />
              <div id="username-searched-card" className="user-name">
                <p className="name">{e.nomprofil}</p>
              </div>
            </div></Link>
            <div className="icon">
                  <button onClick={(elm)=>ajouteramie(elm,e._id,0)} className="btn"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="50" fill="currentColor" className="bi bi-person-add" viewBox="0 0 16 16">
                                            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                                            <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
                                          </svg>
                  </button>
              </div>

          </div>
        </div>
      </div>:""}
       </>
      ))}
    </div>
  );
}

export default Amie;
