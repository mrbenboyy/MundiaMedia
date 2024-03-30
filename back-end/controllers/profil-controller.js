const Users = require("../models/users-model");
const postdb = require("../models/post_model");
const listamie =require("../models/listamie-model");

async function profil(req,res){
    const iduser = req.params.id;
    const iduserauth = req.userid._id;
    const newlistamie =[];
    const user = await Users.findOne({"_id":iduser});
    const posts = await postdb.find({"iduser":iduser});
    const list_amie = await listamie.findOne({"email_user":user.email});
    for(var i=0;i<3 ;i++){
        newlistamie[i]=list_amie.freindlist[i];
    }
    list_amie.freindlist=newlistamie;
    const users = await Users.find();
    res.json({"user":user,"posts":posts,"listamie":list_amie,"users":users,"iduserauth":iduserauth._id});
}


module.exports={profil};