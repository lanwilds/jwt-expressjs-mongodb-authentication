const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var _ = require('lodash'); 

//Verify Token

module.exports = {
  verifyJWTToken:(token)=>{
    return new Promise((resolve, reject) => {
      
        jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
          if (err || !decodedToken) {
            return reject(err)
          }

          resolve(decodedToken)
        })
    })
  },
  createJWToken:(details)=>{
    if (typeof details !== 'object') {
      details = {}
    }

    if (!details.maxAge || typeof details.maxAge !== 'number'){
      details.maxAge = 3600
    }

    details.sessionData = _.reduce(details.sessionData || {}, (memo, val, key) => {
      if (typeof val !== "function" && key !== "password"){
        memo[key] = val
      }

      return memo

    }, {})

    let token = jwt.sign({
      data: details.sessionData
    }, process.env.SECRET, {
        expiresIn: details.maxAge,
        algorithm: 'HS256'
    })

    return token;
  }

};
