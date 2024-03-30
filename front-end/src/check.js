import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Check() {
  const [errors, setErrors] = useState([]);
  const [password, setPassword] = useState();
  const [user_token, setUser_token] = useState({});
  var http;
  const param = useParams();
  const navigate = useNavigate();

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

  async function verify(e) {
    e.preventDefault();
    if (param.id) {
      const resp = await http.post("/dashbord/check/" + param.id + "/" + (password ? password : 0));
      if (resp.data.error) {
        setErrors(resp.data);
      } else {
        navigate(`/Parametre/${param.id}`)
      }
    }
  }
  return (
    <div className="container">
      <center>
        <form onSubmit={(e) => verify(e)} >
          <input type='password' className='form-control' id='password' placeholder="Entre votre mot de passe"
            value={password} onChange={(e) => setPassword(e.target.value)} />
          <span>{errors ? errors.error : ""}</span><br />
          <button id="inscription-button" type='submit' className='btn btn-outline-primary me-md-2'>{"Suivant"}</button>
        </form>
      </center>
    </div>
  );
}
export default Check;