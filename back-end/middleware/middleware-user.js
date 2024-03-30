const jwt = require("jsonwebtoken");
const User = require("../models/users-model");

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.json({ error: 'non authoriser' });
    }

    const token = authorization.split(' ')[1];

    try {
        jwt.verify(token, process.env.secret,function(err,decoded){
            if(err){
                return res.json("error")
            }
            req.userid=decoded
            return next();
        });
    } catch (error) {
        console.log(error);
        res.json({ error: 'non authoriser' });
    }
};

module.exports = { requireAuth };
