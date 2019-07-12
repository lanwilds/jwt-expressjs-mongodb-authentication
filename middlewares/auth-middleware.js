const auth = require('../helpers/auth');

module.exports = {
    verifyJWT_MW:(req, res, next)=>{

        let token = req.headers['authorization'];
        
        if(!token){
            return res.status(400)
            .json({message: "Unauthorized!"})
        }
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }
        auth.verifyJWTToken(token)
            .then((decodedToken) =>
            {
                let user = { 
                    id:decodedToken.data.id,
                    name:decodedToken.data.name, 
                    email:decodedToken.data.email, 
                };
                
                req.user = user
                next()
            })
            .catch((err) =>
            {
                return res.status(400)
                    .json({message: "Unauthorized"})
            })
    }
};