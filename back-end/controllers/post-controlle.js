const postdb = require("../models/post_model");
const users = require("../models/users-model");
const multer = require("multer");
const path= require("path");

const storage = multer.diskStorage({
    destination:(req,file,callbackf)=>{
        callbackf(null, "../front-end/public/images/imagespost/");
    },
    filename:(req,file,callbackf)=>{
        callbackf(null,file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});
var enregistrer = multer({storage:storage});

async function ajouter_post(req,res){
    var post={};
    var resulte={};
    var id_user=req.body.iduser;
    const user_info = await users.findOne({"_id":id_user});
    if(req.file){
        post={
            iduser:id_user,
            profilpost:user_info.imageprofil,
            userpostname:user_info.nomprofil,
            textpost:req.body.textpost,
            imgpost:req.file.filename,
            dateposter:Date.now(),
            commentaire:[],
            jaime:[],
            jaime:0,
        }
    }else{
        post={
            iduser:id_user,
            profilpost:user_info.imageprofil,
            userpostname:user_info.nomprofil,
            textpost:req.body.textpost,
            imgpost:null,
            dateposter:Date.now(),
            commentaire:{},
            jaime:0,
        }
    }
    if(!post.textpost){
        resulte={error:"ecrire votre status!"};
    }else{
       postdb.create(post);
       const listposts = await postdb.find();
        resulte={"posts":listposts};
    };
    res.json(resulte);

};

async function posts(req,res){
    const listposts = await postdb.find();
    res.json({"posts":listposts});

};
async function delelepost(req,res){
await postdb.findByIdAndDelete(req.params.id);
const listposts = await postdb.find();
    res.json(listposts);
}
async function g_jaime(req,res){
    const postjaime = await postdb.findOne({"_id":req.params.idpost});
   if(req.params.action==0){
    const iduser = req.params.iduser;
    postjaime.jaime= postjaime.jaime + 1;
    postjaime.listjaime=[...postjaime.listjaime,iduser];
    await postdb.findOneAndUpdate({"_id":req.params.idpost},postjaime);
   }else{
    const index = postjaime.listjaime.findIndex(e=>e==req.params.iduser);
    postjaime.jaime= postjaime.jaime - 1;
    postjaime.listjaime.splice(index,1);
    await postdb.findOneAndUpdate({"_id":req.params.idpost},postjaime);
   }
    const post = await postdb.find();
    res.json(post);
};


async function comment(req,res){
    const post = await postdb.findOne({"_id":req.params.idpost});
   if(req.params.action==0){
    const user = await users.findOne({"_id":req.params.iduser});
    const newcomment = {
        "idcomment":Date.now(),
        "iduser":req.params.iduser,
        "imgprofil":user.imageprofil,
        "nomprofil":user.nomprofil,
        "comment":req.params.comment
    }
    post.commentaire=[...post.commentaire,newcomment];
    await postdb.findOneAndUpdate({"_id":req.params.idpost},post);
   }else{
    const index = post.commentaire.findIndex(e=>e.idcomment==req.params.idcomment);
    post.commentaire.splice(index,1);
    await postdb.findOneAndUpdate({"_id":req.params.idpost},post);
   }
   const postup=await postdb.findOne({"_id":req.params.idpost});
   res.json(postup.commentaire);
}

async function list_comment(req,res){
    const iduser=req.userid._id;
    const post = await postdb.findOne({"_id":req.params.idpost});
    res.json({"iduser":iduser._id,"postcomment":post.commentaire});

}

module.exports={enregistrer,ajouter_post,posts,delelepost,g_jaime,comment,list_comment};