const mongoose = require("mongoose");

const usershema=new mongoose.Schema({
    nom:{
        type:String
    },
    prenom:{
        type:String
    },
    nomprofil:{
        type:String
    },
    telefon:{
        type:String
    },
    datenaissance:{
        type:Date
    },
    imageprofil:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    }
});


const users = mongoose.model("users",usershema);

module.exports=users;