import axios from "axios";
import "./style.css";
import "./style2.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
function Post(props) {
  const [user_token, setUser_token] = useState({});
  const [errors, setErrors] = useState({});
  const [posts, setPosts] = useState([]);
  const [Imgpost, setImgpost] = useState("");
  const [textpost, setTextpost] = useState("");
  const [comment, setComment] = useState("");

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
  }, [user_token]);
  useEffect(() => {
    listpost()
  });

  async function listpost() {
    const resp = await http.get("/dashbord/posts");
    setPosts(resp.data.posts);
  }
  async function delelepost(elm, id) {
    elm.preventDefault();
    const resp = await http.delete("/dashbord/posts/" + id);
    setPosts(resp.data);
  }
  async function ajouterpost(e) {
    e.preventDefault();
    console.log(props.user);
    if (props.user) {
      const formdata = new FormData();
      formdata.append("iduser", props.user._id);
      formdata.append("imgpost", Imgpost);
      formdata.append("textpost", textpost);
      const resp = await http.post("/dashbord/post", formdata);
      if (resp.data.error) {
        setErrors(resp.data);
      } else {
        setTextpost("")
        setPosts(resp.data.posts);
      }
    }
  };


  const [imgPreview, setImgPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgpost(file);
      setImgPreview(URL.createObjectURL(file));
    }
  };
  async function jaimepost(elm, idpost, iduserjaime, action) {
    elm.preventDefault();
    const resp = await http.patch("/dashbord/jaime/" + idpost + "/" + iduserjaime + "/" + action);
    setPosts(resp.data);
  };
  async function commentaire(elm, idpost, iduser, action) {
    elm.preventDefault();
    if (comment) {
      await http.patch("/dashbord/comment/" + idpost + "/" + iduser + "/" + comment + "/" + action);
      setComment("")
    }
  }
  return (<div>
    <div className="containerpost">
      <div className="wrapper">
        <section className="post">
          <form onSubmit={(e) => { ajouterpost(e) }} encType="multipart/form-data" className="formpost">
            <div className="content">
              <img src={"/images/imagesprofil/" + props.user.imageprofil} alt="logo" />
              <div className="details">
                <p>{props.user.nomprofil}</p>
              </div>
            </div>
            <textarea value={textpost} rows="3" placeholder="Quoi de neuf ?," required onChange={(e) => setTextpost(e.target.value)}></textarea>
            <div className="options">
              {imgPreview ? (
                <img src={imgPreview} alt="Preview" className="img-preview" />
              ) : (
                <>
                  <p>Add to Your Post</p>
                  <ul className="list">
                    <li>
                      <label htmlFor="img-post">
                        <img src="gallery.svg" alt="gallery" />
                      </label>
                      <input type="file" id="img-post" className="imgepost" onChange={handleImageChange} />
                    </li>
                  </ul>
                </>
              )}
            </div>
            <span>{errors ? errors.error : ""}</span><br />
            <button type="submit">Post</button>
          </form>
        </section>
      </div>
    </div><br /><br />
    <center><h2>Recent posts</h2></center><br/>
    {posts && posts.sort((a, b) => new Date(b.dateposter) - new Date(a.dateposter)).map((e, i) =>
      <section key={i}>
        <div id="card-posts" className="card">
          <div className="top">
            <Link className="text-decoration-none text-dark" to={`/Profil/${e.iduser}`}>
              <div className="info">
                <img id="image-post" src={"/images/imagesprofil/" + e.profilpost} alt="" />
                <div className="user-name">
                  <p className="name">{e.userpostname}</p>
                  <p className="id">{new Date(e.dateposter).toLocaleString()}</p>
                </div>
              </div>
            </Link>
            {props.user._id === e.iduser ? <div className="icon">
              <button className="btn" onClick={(elm) => delelepost(elm, e._id)}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="50" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
              </svg>
              </button>
            </div> : ""}
          </div>
          <p id="text-post" className="id">{e.textpost}</p>
          <div className="body">
            {e.imgpost ? <img src={"/images/imagespost/" + e.imgpost} className="card-img" alt="profil"></img> : ""}
            <div className="body-icons">
              <div className="left-icon">
                {!(e.listjaime.includes(props.user._id)) ? <div  style={{marginRight: "30px"}}>
                  <button onClick={(elm) => jaimepost(elm, e._id, props.user._id, 0)} className="btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="50" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                      <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                    </svg>
                  </button>
                  {e.jaime}
                </div> : <div style={{marginRight: "30px"}}>
                  <button onClick={(elm) => jaimepost(elm, e._id, props.user._id, 1)} className="btn">
                    <svg fill="red" stroke="red" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
                      </path>
                    </svg>
                  </button>
                  {e.jaime}</div>}
              </div>
              <div className="right-icon">
                <button className="btn">
                  <Link to={`/Comment/${e._id}`}><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                    </path>
                  </svg></Link>
                </button>
              </div>
            </div>
          </div>
          <div className="bottom-section">
            <form encType="multipart/form-data" onSubmit={(elm) => commentaire(elm, e._id, props.user._id, 0)} className="bottom">
              <input value={comment} type="text" placeholder="Add A Comment..." onChange={(e) => setComment(e.target.value)} />
              <button type="submit" className="btn">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </section>
    )}
  </div>
  );

};

export default Post;