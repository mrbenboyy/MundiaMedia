const mongoose =require('mongoose');

const Listamieshema=new mongoose.Schema({
    email_user:{
        type:String,
    },
    freindlist:{
        type:Array,
    }

});


const Listamie = mongoose.model("Listamie",Listamieshema);

module.exports=Listamie;