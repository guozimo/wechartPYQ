const express = require("express");

const router = express.Router();

const bcrypt = require("bcrypt");

const User = require("../../models/User");

const gravatar = require("gravatar");

const jwt = require("jsonwebtoken");

const passport = require("passport");

router.get("/test",(req,res) => {
    res.json({msg:"你好啊!"})
})
//注册接口
router.post("/registered",(req,res) => {
    User.findOne({email:req.body.email})
        .then((user) => {
            if (user) {
                return res.status(200).json({msg:"邮箱已被注册!"})
            } else {
                const avatar = gravatar.url(req.body.email,{s:'200',r:'pg',d:'mm'})
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                })

                bcrypt.genSalt(10,function(err,salt) {
                    bcrypt.hash(newUser.password,salt,(err,hash) => {
                        if (err) throw err;

                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    })
                })
            }
        })
})
//登陆接口
router.post("/login",(req,res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then((user) => {
            if (!user) {
                return res.status(200).json({msg:'用户不存在!'})
            }

            bcrypt.compare(password,user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // res.json({msg:"success!"});
                        const rule = {
                            id: user.id,
                            name:user.name,
                            avatar:user.avatar,
                        }
                        jwt.sign(rule,"secret",{expiresIn:3600},(err,token) => {
                            if (err) throw err

                            res.json({
                                success:true,
                                token:"Bearer " + token
                            })
                        })
                    } else {
                        return res.status(200).json({msg:"密码错误!"});
                    }
                })
        })
})

router.get("/current",passport.authenticate("jwt",{session:false}),(req,res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user,avatar
    })
})

module.exports = router;