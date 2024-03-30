const users = require("../models/users-model");
const listamie =require("../models/listamie-model");

async function ajouteramie(req,res){
    const iduser = req.userid._id;
    const idamie = req.params.idamie;
    const action = req.params.action;
    const user= await users.findOne(iduser);
    const listuseramie = await listamie.findOne({"email_user":user.email});
    if(action==0){
        listuseramie.freindlist=[...listuseramie.freindlist,idamie];
        await listamie.findOneAndUpdate({"_id":listuseramie._id},listuseramie);    
    }else{
        const index = listuseramie.freindlist.findIndex(e=>e==idamie);
        listuseramie.freindlist.splice(index,1);
        await listamie.findOneAndUpdate({"_id":listuseramie._id},listuseramie);
    }
    const newlistamie = await listamie.findOne({"email_user":user.email});
    res.json(newlistamie);
}



module.exports = {ajouteramie};