const mongoose =require('mongoose');

const postshema=new mongoose.Schema({
    iduser:{
        type:String,
    },
    profilpost:{
        type:String
    },
    userpostname:{
        type:String
    },
    textpost:{
        type:String
    },
    imgpost:{
        type:String
    },
    dateposter:{
        type:Date
    },
    commentaire:{
        type:Array,
    },
    listjaime:{
        type:Array,
    },
    jaime:{
        type:Number,
    }

});


const post = mongoose.model("post",postshema);

module.exports=post;