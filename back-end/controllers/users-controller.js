const users = require("../models/users-model");
const listamie = require("../models/listamie-model");
const postdb = require("../models/post_model");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");




const storage = multer.diskStorage({
    destination: (req, file, callbackf) => {
        callbackf(null, "../front-end/public/images/imagesprofil/");
    },
    filename: (req, file, callbackf) => {
        callbackf(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});
var enregistrer = multer({ storage: storage });
const createtoken = (_id) => {
    return jwt.sign({ _id }, process.env.secret, { expiresIn: '3d' });
}


async function inscription(req, res) {
    var resulte = {};
    var user = {}
    if (req.file) {
        user = {
            nom: req.body.nom,
            prenom: req.body.prenom,
            nomprofil: req.body.prenom + " " + req.body.nom,
            telefon: req.body.telefon,
            datenaissance: req.body.datenaissance,
            imageprofil: req.file.filename,
            email: req.body.email,
            password: req.body.password
        };
        var exicte = await users.findOne({ "email": user.email });
    }
    if (!user.nom || !user.prenom || !user.datenaissance || !user.telefon || !user.email || !user.password) {
        resulte = { error: "tous les champs doivent être remplis!" };
        if (user.imageprofil) {
            fs.unlinkSync("../front-end/public/images/imagesprofil/" + user.imageprofil);
        }
    }
    else if (!validator.isEmail(user.email)) {
        resulte = { error: "L'email n'est pas valide!" };
        if (user.imageprofil) {
            fs.unlinkSync("../front-end/public/images/imagesprofil/" + user.imageprofil);
        }
    }
    else if (!validator.isStrongPassword(user.password) || user.password.lentgh < 8) {
        resulte = { error: "Le mot de passe n'est pas fort!" };
        if (user.imageprofil) {
            fs.unlinkSync("../front-end/public/images/imagesprofil/" + user.imageprofil);
        }
    }
    else if (exicte) {
        resulte = { error: "Ce email est déjà utilisé!" };
        if (user.imageprofil) {
            fs.unlinkSync("../front-end/public/images/imagesprofil/" + user.imageprofil);
        }
    }
    else {
        const salte = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salte);
        users.create(user);
        const freind_list = {
            email_user: user.email,
            freindlist: [],
        };
        listamie.create(freind_list);
        resulte = { "user": user }
    }

    res.json(resulte);
};
async function conexion(req, res) {
    const user = req.body;
    var resulte = {};
    const exicte = await users.findOne({ "email": user.email });
    if (!user.email || !user.password) {
        resulte = { error: "tous les champs doivent être remplis!" };
    }
    else if (!exicte) {
        resulte = { error: "Adresse Email incorrecte!" };
    } else {
        const comparer = await bcrypt.compare(user.password, exicte.password);
        if (!comparer) {
            resulte = { error: "Mot de passe incorrecte!" };
        } else {
            const id = await users.findOne({ "email": user.email }).select('_id');
            const token = createtoken(id);
            resulte = { "user": exicte.email, "token": token };
        }
    }
    res.json(resulte);
};
async function aficheruser(req, res) {
    const id = req.userid._id
    const user = await users.findOne(id);
    res.json(user);
}
async function userslist(req, res) {
    const list_user = await users.find();
    const iduser = req.userid._id;
    if (iduser) {
        const user = await users.findOne(iduser);
        const freind = await listamie.findOne({ "email_user": user.email });
        const index = list_user.findIndex(e => e._id == iduser._id);
        list_user.splice(index, 1);
        res.json({ "user": list_user, "freind": freind });
    }
}
async function amielist(req, res) {
    const list_user = await users.find();
    const iduser = req.params.id;
    const userauthid = req.userid._id
    const user = await users.findOne({ "_id": iduser });
    const userauth = await users.findOne(userauthid);
    const freind = await listamie.findOne({ "email_user": user.email });
    res.json({ "user": list_user, "freind": freind, "userauth": userauth });
}

async function check(req, res) {
    var resulte = {};
    var comparer;
    const iduser = req.params.id;
    const password = req.params.password;
    const user = await users.findOne({ "_id": iduser });
    if (!password == 0) {
        comparer = await bcrypt.compare(password, user.password);
    } else {
        resulte = { error: "Le champ doit être rempli!" };
    }
    if (!comparer) {
        resulte = { error: "Mot de passe incorrecte!" };
    } else {
        resulte = { Success: "Votre mot de passe est correcte" };
    }
    res.json(resulte);
}

async function info(req, res) {
    const id = req.params.id
    const user = await users.findOne({ "_id": id });
    res.json(user);
}

async function modifier_info(req, res) {
    const id = req.params.id;
    const info = req.params.info;
    const type = req.params.type;
    const user = await users.findOne({ "_id": id });
    if (type == "nomprofil") {
        var post = [];
        post = await postdb.find({ "iduser": user._id });
        if (post) {
            for (var i = 0; i < post.length; i++) {
                post[i].userpostname = info;
                await postdb.findByIdAndUpdate({ "_id": post[i]._id }, post[i]);
            }
        }
        user.nomprofil = info;
        await users.findOneAndUpdate({ "_id": id }, user);
    } else if (type == "imageprofil") {
        var post = [];
        post = await postdb.find({ "iduser": user._id });
        if (post) {
            for (var i = 0; i < post.length; i++) {
                post[i].profilpost = req.file.filename;
                await postdb.findByIdAndUpdate({ "_id": post[i]._id }, post[i]);
            }
        }
        fs.unlinkSync("../front-end/public/images/imagesprofil/" + user.imageprofil);
        user.imageprofil = req.file.filename;
        await users.findOneAndUpdate({ "_id": id }, user);
    } else if (type == "datenaissance") {
        user.datenaissance = info;
        await users.findOneAndUpdate({ "_id": id }, user);
    } else if (type == "telefon") {
        user.telefon = info;
        await users.findOneAndUpdate({ "_id": id }, user);
    } else if (type == "email") {
        user.email = info;
        await users.findOneAndUpdate({ "_id": id }, user);
    } else if (type == "password") {
        const salte = await bcrypt.genSalt();
        user.password = await bcrypt.hash(info, salte);
        await users.findOneAndUpdate({ "_id": id }, user);
    }
    const newuser = await users.findOne({ "_id": id });
    res.json(newuser);
}

async function deletecompte(req, res) {
    const idcompte = req.params.id;
    var post = [];
    post = await postdb.find();
    var resulte;
    if (idcompte) {
        const user = await users.findOne({ "_id": idcompte });
        const list_amie = await listamie.findOne({ "email_user": user.email }).select("_id");
        for (var i = 0; i < post.length; i++) {
            if (post[i].commentaire) {
                var filterpost = post[i].commentaire.filter((e) => !(e.iduser == idcompte));
                post[i].commentaire = filterpost;
                await postdb.findOneAndUpdate({ "_id": post[i]._id }, post[i]);
            };
            if (post[i].listjaime.includes(idcompte)) {
                var filterjaime = post[i].listjaime.filter((e) => !(e == idcompte));
                post[i].jaime = post[i].jaime - 1;
                post[i].listjaime = filterjaime;
                await postdb.findOneAndUpdate({ "_id": post[i]._id }, post[i]);
            }
            if (post[i].iduser == idcompte) {
                fs.unlinkSync("../front-end/public/images/imagespost/" + post[i].imgpost);
                await postdb.findByIdAndDelete(post[i]._id);
            }
        }
        await listamie.findByIdAndDelete((list_amie._id));
        fs.unlinkSync("../front-end/public/images/imagesprofil/" + user.imageprofil);
        await users.findByIdAndDelete(idcompte);
        resulte = { success: "le compte est bien supprimer " }
    } else {
        resulte = { error: "le compte n'ai pas supprimer! " }
    }

    res.json(resulte);
}

module.exports = { inscription, conexion, aficheruser, enregistrer, userslist, amielist, check, info, modifier_info, deletecompte };