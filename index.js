const express = require('express')
const app  = express()
const PORT = process.env.PORT || 5000
const path = require('path')
const ejs = require('ejs')
const basicRouter = require('./routes/basic-routes')
const passportSetup = require('./config/passport-setup')
const passport = require('passport')
const cookieSession = require('cookie-session')
const mongoose = require('mongoose')
const authenticate = require('./routes/profile-routes')
const session = require('express-session')

mongoose.connect(process.env.MONGO_DB,{ useNewUrlParser: true ,useUnifiedTopology: true})


app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
  }))

app.use(passport.initialize())
app.use(passport.session())


app.use('/api',basicRouter)



app.use(express.static(path.join(__dirname + '/assets/Login_v11')))
app.use(express.static(path.join(__dirname + '/assets')))
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname + '/assets/Login_v11/index.html'))
})
app.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname + '/assets/Login_v11/signup.html'))
})
app.get('/profile',authenticate,(req,res)=>{
    res.sendFile(path.join(__dirname + '/assets/index.html'))
})


app.listen(PORT,()=>console.log(`App running on ${PORT}.`))