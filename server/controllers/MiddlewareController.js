const jwt = require('jsonwebtoken');

const middlewareController = {
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if(token){
            const accessToken = token;
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY,(err,user)=>{
                if(err){
                    res.status(403).json('Token is not valid');
                }
                req.user = user;
                next();
            });
        }
        else{
            res.status(401).json('You are not authenticated');
        }
    },
    verifyTokenAndAdmin:(req,res,next)=>{
        middlewareController.verifyToken(req,res,()=>{
            if(req.user.Position === 'Admin'){
                next();
            }
            else{
                res.status(403).json('Permission denied')
            }
        });
    },

    verifyTokenAndClient:(req,res,next)=>{
        middlewareController.verifyToken(req,res,()=>{
            if(req.user.Position === 'Client'){
                next();
            }
            else{
                res.status(403).json('Permission denied')
            }
        });
    },
}

module.exports = middlewareController;