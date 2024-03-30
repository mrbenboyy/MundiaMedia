const express = require("express");
const router = express.Router();
const userscontrolle = require("../controllers/users-controller");
const postcontrolle= require("../controllers/post-controlle");
const userauth=require("../middleware/middleware-user");
const listamiecontrolle = require("../controllers/Listamie-controlle");
const profilcontrolle=require("../controllers/profil-controller")

router.use(userauth.requireAuth);
router.patch("/jaime/:idpost/:iduser/:action",postcontrolle.g_jaime);
router.patch("/comment/:idpost/:iduser/:comment/:action",postcontrolle.comment);
router.delete("/comment/:idpost/:idcomment/:action",postcontrolle.comment);
router.get("/comments/:idpost",postcontrolle.list_comment);
router.get("/profil/:id",profilcontrolle.profil);
router.get("/info/:id",userscontrolle.info);
router.delete("/supprimer-compte/:id",userscontrolle.deletecompte);
router.post("/modifier-info/:id/:info/:type",userscontrolle.enregistrer.single("imageprofil"),userscontrolle.modifier_info);
router.post("/check/:id/:password",userscontrolle.check);
router.patch("/amie/:idamie/:action",listamiecontrolle.ajouteramie);
router.get("/",userscontrolle.aficheruser);
router.get("/users",userscontrolle.userslist);
router.get("/users/:id",userscontrolle.amielist);
router.get("/posts",postcontrolle.posts);
router.delete("/posts/:id",postcontrolle.delelepost);
router.post("/post",postcontrolle.enregistrer.single("imgpost"),postcontrolle.ajouter_post);


module.exports=router;