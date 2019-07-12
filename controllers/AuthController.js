//Models
const User = require('../models/User');


const auth = require('../helpers/auth');
const user = new User();
const Joi = require('@hapi/joi');
//Login Controller
module.exports = {
    index:async (req,res)=>{
        res.status(200).json({
            message:"Index",
            user:req.user
        });
    },
    login:async (req,res)=>{
        let { email,password } = req.body;
        const validate = Joi.validate({
            email,
            password
        },{
            email: Joi.string().email({ minDomainSegments: 2 }).required(),
            password: Joi.string().min(6).required(),
        })
        
        if(validate.error){
            return res.status(400).json(validate.error);
        }
        
        await User.findOne({email:email},async (error,user)=>{
            if(!user){
                return res.status(400).json({message:'Unauthorized'})
            }
            if(!user.validPassword(password)) {
                return res.status(400).json({message:'Unauthorized'})
            } else {
                let userDump = {
                    id:user._id,
                    name:user.name,
                    email:user.email,
                };
                let token = auth.createJWToken({
                    sessionData: userDump,
                    maxAge: 3600
                })
                return res.status(200).json({
                    token:token,
                    expiration:3600
                });
            }
        })
        .catch((error)=>{
            console.log(error)
            return res.status(400).json({message:'Unauthorized'})

        })
        
    },
    register:async (req,res)=>{
        let { name,password,email } = req.body;
        const validate = Joi.validate({
            password,
            name,
            email
        },{
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email({ minDomainSegments: 2 }).required(),
            password: Joi.string().min(6).required(),
        });

        if(validate.error){
            return res.status(400).json(validate.error);
        }

        const newUser = new User({
            email:email,
            name:name,
            password:user.generateHash(password)
        });

        await newUser.save().then((user)=>{
            return res.status(200).json({
                user:user,
                status:'success'
            });
        },(error)=>{
            return res.status(400).json({
                status:'failed'
            });
        })

    },
    
};