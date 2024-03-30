import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Amie from "./amie";
function Layout() {
    const [user, setUser] = useState();
    const [user_token, setUser_token] = useState({});
    const [userid, setUserid] = useState();
    var http;
    useEffect(() => {
        const users = localStorage.getItem('user');
        if (users) {
            setUser_token(users);
            Utilisateur();
        }
    }, [user_token]);

    if (user_token) {
        http = axios.create({
            baseURL: "http://localhost:5000",
            headers: {
                "Content-Type": "apllication/json",
                'Authorization': `Bearer ${user_token}`,
            },
        });
    };

    async function Utilisateur() {
        const resp = await http.get('/dashbord');
        setUserid(resp.data);

    }
    function déconexion() {
        localStorage.removeItem('user');
        window.location.reload(false);
    }
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setUser(user);
        }
    }, [])
    return (
        <div className="container">
            <nav id="navbar-bg" className="navbar navbar-expand-lg d-flex justify-content-center align-items-center">
                <ul className="navbar-nav">
                    <li className="navbar-brand">
                        <Link style={{marginRight: "150px"}} className="d-flex justify-content-start text-decoration-none text-white" to="/"><h1 id="logo-navbar">MundiaMedia</h1></Link>
                    </li>
                    {user ? (
                        <>
                            <li className="nav-item m-auto me-2">
                                <Link className="text-decoration-none" to={`/Profil/${userid ? userid._id : ""}`} ><button className="btn btn-outline-light">Profil</button></Link>
                            </li>
                            <li className="nav-item m-auto me-2">
                                <Link className="text-decoration-none" to={`/Check/${userid ? userid._id : ""}`} ><button className="btn btn-outline-light ms-2">Paramétre</button></Link>
                            </li>
                            <li className="nav-item m-auto">
                                <button className="btn btn-danger text-white ms-2" onClick={() => déconexion()}>Déconnexion</button>
                            </li>
                        </>
                    ) : (
                        <li className="nav-item m-auto">
                            <Link className="btn btn-danger text-white ms-2" to="/Conexion">Se Connecter</Link>
                        </li>
                    )}
                </ul>
            </nav><br/>
            <main>
                <Outlet />
            </main><br/><br/><br/>
            <div className="container">
                <footer className="d-flex flex-wrap justify-content-center py-3 my-4 border-top">
                    <center>
                        <span className=" text-dark">© 2023 B_O</span>
                    </center>
                </footer>
            </div>
        </div>
    );
}
export default Layout;