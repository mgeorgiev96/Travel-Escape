

const UserAuth = (req,res,next)=>{
    if(!req.user && !req.session.user){
        res.redirect('/')
    }else{
        next()
    }
}

module.exports = UserAuth