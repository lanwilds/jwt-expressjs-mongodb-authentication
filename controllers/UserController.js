const User = require('../models/User');

//User Controller
module.exports = {
    index:async (req,res)=>{
        res.status(200).json({
            message:"Index",
            user:req.user
        });
    },
    store:(req,res)=>{
    	let { name,email,address,age } = req.body;
    	if(name && email && address && age){

    		const user = new User({
    			name:name,
    			email:email,
    			address:address,
    			age:age
    		});

    		user.save()
    			.then(userdoc =>{
    				res.status(200).json({
    					message:"success"
    				});
    			}, error =>{
    				res.status(400).json({
    					message:"failed"
    				});
    			})


    	} else {
    		res.status(422).json({
    			message:"invalid inputs"
    		});
    	}

    },
    show:async (req,res)=>{
    	let { id } = req.params;
    	if(id){
    			try{
    				let user = await User.findById(id);
    		    	res.status(200).json(user);
    			}
    			catch(error){
    		    	res.status(400).json({message:"Could not fetch user"});
    			}
    	} else {
    		res.status(422).json({
    			message:"invalid inputs"
    		});
    	}

    },
    update:async (req,res)=>{
    	let { id } = req.params;
    	let { name,email,address,age } = req.body;
    	if(id){
    		if(name && email && address && age){
    				try{
    					let user = await User.findByIdAndUpdate(id,{
    						$set:{
    							name:name,
    							email:email,
    							address:address,
    							age:age
    						}
    					});
    					if(user){
    			    		res.status(200).json({message:"User Updated",user:user});
    					} else {
    						res.status(422).json({
    							message:"User not found"
    						});
    					}
    				}
    				catch(error){
    			    	res.status(400).json({message:"Could not update user"});
    				}
    		} else {
    			res.status(422).json({
    				message:"invalid inputs"
    			});
    		}
    	} else {
    		res.status(422).json({
    			message:"Invalid ID"
    		});
    	}

    },
    delete:async (req,res)=>{
    	let { id } = req.params;
    	if(id){
    		try{
    			let user = await User.findByIdAndDelete(id);
    			if(user){
    				res.status(200).json({message:"User Deleted",user:user});
    			} else {
    				res.status(422).json({
    					message:"User not found"
    				});
    			}
    			
    		}
    		catch(error){
				res.status(400).json({message:"Could not delete user"});
    		}
    	} else {
    		res.status(422).json({
    			message:"Invalid ID"
    		});
    	}
    }
    
};