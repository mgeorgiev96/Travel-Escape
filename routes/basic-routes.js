const stripe = require('stripe')('sk_test_51GxXTwJWnlXzpGEmQ7QU6Vry213lP7XVpRiJ0rLxxwijpYPSBCeNDF4KISxQ2OEB1SFZE26nUKc2FmYGvI66to40008X6y2OQq')
const router = require('express').Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const User= require('../models/model')
const uniqid = require('uniqid')
const authenticate = require('../routes/profile-routes')

//Logout
router.get('/logout',(req,res)=>{
    if(req.user){
        req.logout()
    }else{
        req.session.user=null
    }
    res.redirect('/')
})

//Login
router.post('/login',(req,res)=>{
    User.findOne({username:req.body.email}).then(user=>{
        if(user){
            bcrypt.compare(req.body.pass,user.password,(err,result)=>{
                if(result){
                    req.logout()
                    req.session.user = {
                        username: user.username,
                        name: user.name,
                        thumbnail: user.thumbnail,
                        tickets: user.tickets,
                        subscribe: user.subscribe
                    }
                    res.redirect('/profile')
                }else{
                    res.redirect('/api/wrong-password')
                }
            })
        }else{
            res.redirect('/api/wrong-username')
        }
    }).catch(err=>console.log(err))
})


//Signup
router.post('/signup',(req,res)=>{
    bcrypt.hash(req.body.pass,10,(err,hash)=>{
        User.findOne({username:req.body.email}).then(user=>{
            if(user){
                res.redirect('/api/user-exist')
            }else{
                new User({
                    username: req.body.email,
                    password: hash,
                    name: req.body.name,
                    thumbnail: "https://img.icons8.com/windows/32/000000/user-male-circle.png",
                    tickets: [],
                    subscribe: false

                }).save().catch(err=>console.log(err))
            }
        }).then(user=>res.redirect('/')).catch(err=>console.log(err))
    })
})

//Process payment
router.post('/payment',(req,res)=>{
    stripe.customers.create({
        email: req.body.userEmail,
        source: req.body.stripeTokenId
    }).then(customer=>{
        stripe.charges.create({
            amount: req.body.price,
            customer: customer.id,
            description: req.body.nameOfPurchase,
            currency: 'usd'
        })
        if(!req.user){
            User.updateOne({username:req.session.user.username},{
                $push: {tickets:{price:req.body.price / 100,name:req.body.nameOfPurchase,id:uniqid()}}
            }).then(r=>{
                User.findOne({username:req.session.user.username}).then(user=>{
                    req.session.user = {
                        username: user.username,
                        name: user.name,
                        thumbnail: user.thumbnail,
                        tickets: user.tickets,
                        subscribe: user.subscribe
                    }
                }).then(r=>res.send('Success')).catch(err=>console.log(err))
            }).catch(err=>console.log(err))
        }else{
            User.updateOne({username:req.user.username},{
                $push: {tickets:{price:req.body.price / 100,name:req.body.nameOfPurchase,id:uniqid()}}
            }).then(r=>{
                User.findOne({username:req.user.username}).then(user=>{
                    req.user = {
                        username: user.username,
                        name: user.name,
                        thumbnail: user.thumbnail,
                        tickets: user.tickets,
                        subscribe: user.subscribe
                    }
                }).then(r=>res.send('Success')).catch(err=>console.log(err))
            }).catch(err=>console.log(err))
        }
    })
})

//Tickets Page
router.get('/tickets',authenticate,(req,res)=>{
    if(!req.user){
        res.render('tickets',{user:req.session.user.name, tickets:req.session.user.tickets})
    }else{
        res.render('tickets',{user:req.user.name, tickets:req.user.tickets})
    }
})

//Refund Ticket
router.post('/refund-ticket',(req,res)=>{
    if(!req.user){
        User.updateOne({username:req.session.user.username},{
            $pull:{tickets:{id:req.body.id}}
        }).then(r=>{
            User.findOne({username:req.session.user.username}).then(user=>{
                req.session.user = {
                    username: user.username,
                    name: user.name,
                    thumbnail: user.thumbnail,
                    tickets: user.tickets,
                    subscribe: user.subscribe
                }
            }).then(r=>res.send('Success')).catch(err=>console.log(err))
        }).catch(err=>console.log(err))
    }else{
        User.updateOne({username:req.user.username},{
            $pull:{tickets:{id:req.body.id}}
        }).then(r=>{
            User.findOne({username:req.user.username}).then(user=>{
                req.user = {
                    username: user.username,
                    name: user.name,
                    thumbnail: user.thumbnail,
                    tickets: user.tickets,
                    subscribe: user.subscribe
                }
            }).then(r=>res.send('Success')).catch(err=>console.log(err))
        }).catch(err=>console.log(err))
    }
})

//Info
router.get('/info',(req,res)=>{
    if(!req.user){
        res.json({
            subscribed: req.session.user.subscribe,
            email: req.session.user.username
        })
    }else{
        res.json({
            subscribed: req.user.subscribe,
            email: req.user.username
        })
    }
})

//Subscribe Route
router.get('/subscribe',(req,res)=>{
    if(!req.user){
        User.findOne({username:req.session.user.username}).then(user=>{
            if(user.subscribe===false){
                User.updateOne({username:user.username},{
                    subscribe: true
                }).then(i=>{
                    User.findOne({username:req.session.user.username}).then(user=>{
                        req.session.user = {
                            username: user.username,
                            name: user.name,
                            thumbnail: user.thumbnail,
                            tickets: user.tickets,
                            subscribe: user.subscribe
                        }
                    }).then(r=>res.send('Success')).catch(err=>console.log(err))
                }).catch(err=>console.log(err))
            }else{
                User.updateOne({username:user.username},{
                    subscribe: false
                }).then(i=>{
                    User.findOne({username:req.session.user.username}).then(user=>{
                        req.session.user = {
                            username: user.username,
                            name: user.name,
                            thumbnail: user.thumbnail,
                            tickets: user.tickets,
                            subscribe: user.subscribe
                        }
                    }).then(r=>res.send('Success')).catch(err=>console.log(err))
                }).catch(err=>console.log(err)).catch(err=>console.log(err))
            }
        })
    }else{
        User.findOne({username:req.user.username}).then(user=>{
            if(user.subscribe===false){
                User.updateOne({username:user.username},{
                    subscribe: true
                }).then(i=>{
                    User.findOne({username:req.user.username}).then(user=>{
                        req.user = {
                            username: user.username,
                            name: user.name,
                            thumbnail: user.thumbnail,
                            tickets: user.tickets,
                            subscribe: user.subscribe
                        }
                    }).then(r=>res.send('Success')).catch(err=>console.log(err))
                }).catch(err=>console.log(err))
            }else{
                User.updateOne({username:user.username},{
                    subscribe: false
                }).then(i=>{
                    User.findOne({username:req.user.username}).then(user=>{
                        req.user = {
                            username: user.username,
                            name: user.name,
                            thumbnail: user.thumbnail,
                            tickets: user.tickets,
                            subscribe: user.subscribe
                        }
                    }).then(r=>res.send('Success')).catch(err=>console.log(err))
                }).catch(err=>console.log(err)).catch(err=>console.log(err))
            }
        })
    }
})

//Wrong Username
router.get('/wrong-username',(req,res)=>{
    res.render('username')
})

//Wrong Password
router.get('/wrong-password',(req,res)=>{
    res.render('password')
})

//User Exist
router.get('/user-exist',(req,res)=>{
    res.render('create')
})


//Google Authentication
router.get('/google',passport.authenticate('google',{
    scope: ['https://www.googleapis.com/auth/plus.login',"email"],
    prompt: ['select_account']
}))

//Profile Page Redirect
router.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
    res.redirect('/profile')
})

module.exports = router

