import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function Commentlist(){
const param = useParams();
const [user_token, setUser_token] = useState({});
const [comment_list, setComment_list] = useState();
const [id_user,setId_user]=useState("");
const [comment,setComment]=useState("");
const navigete = useNavigate();

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
useEffect(()=>{
    listcomment();
})

async function commentaire(elm,idpost,iduser,action){
    elm.preventDefault();
   if(comment){
    const resp = await http.patch("/dashbord/comment/"+idpost+"/"+iduser+"/"+comment+"/"+action);
    setComment_list(resp.data);
    setComment("")
   }
}
async function listcomment(){
    if(param){
        const resp = await http.get("/dashbord/comments/"+param.id);
        setComment_list(resp.data.postcomment);
        setId_user(resp.data.iduser);
    }
}
async function deletecomment(elm,idpost,idcomment,action){
    elm.preventDefault();
    const resp = await http.delete("/dashbord/comment/"+idpost+"/"+idcomment+"/"+action);
    setComment_list(resp.data);
}
    return(
       <div className="container">
        <button style={{width: "150px", marginBottom: "30px"}} className="btn btn-outline-primary" onClick={()=>navigete(-1)}>back</button>
        <h4>Les commentaires</h4>
      {comment_list && comment_list.map((e,i) => (
        <div key={i}>
        <div id="comments-card" className="card">
          <div className="top">
            <div className="info">
              <img style={{width: "50px", height: "50px"}} src={"/images/imagesprofil/" + e.imgprofil} alt="" />
              <div id="comment-username-container" className="user-name">
                <p id="comment-username" className="name">{e.nomprofil}<span id="comment">{e.comment}</span></p>
              </div>
            </div>
            <div className="icon">
                  {id_user===e.iduser?<button onClick={(elm)=>deletecomment(elm,param.id,e.idcomment,1)} className="btn"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="50" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                            </svg>
                  </button>:""}
              </div>
                
          </div>
        </div>
      </div>
      ))}
      <div className="bottom-section">
                  <form encType="multipart/form-data" onSubmit={(elm)=>commentaire(elm,param.id,id_user,0)} className="bottom">
                    <input value={comment} type="text" placeholder="Ajouter un commentaire..." onChange={(e) => setComment(e.target.value)} />
                      <button type="submit" className="btn">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                      </button>
                  </form>
            </div>
    </div>
    )
}

export default Commentlist;