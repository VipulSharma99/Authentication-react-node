const express = require('express');
const app = express();
const cors = require('cors');
const stytch = require('stytch');
const dotenv = require('dotenv');

app.use(cors());
app.use(express.json());
dotenv.config();

const client = new stytch.Client({
    project_id: process.env.PROJECT_ID,
    secret: process.env.SECRET,
    env: stytch.envs.test
});

const authMiddleware = (req,res,next)=>{
    const sessionToken = req.headers.sessiontoken;
    console.log('auth',sessionToken)
    client.sessions.authenticate({session_token: sessionToken})
        .then(()=>{
            next();
        }).catch((err)=>{
            res.status(401).json(err);
        })
}

app.post("/login", async (req,res)=>{
    const email = req.body.email;
    const params = {
        email,
        login_magic_link_url: "http://localhost:3000/auth",
        signup_magic_link_url: "http://localhost:3000/auth"
    };
    const response = await client.magicLinks.email.loginOrCreate(params);
    res.json(response);
});

app.post("/auth", async (req,res)=>{
    try{
        const token = req.body.token
        console.log(token);
        const sessionToken = await client.magicLinks.authenticate(token,{
            session_duration_minutes: 30,
        });
        res.json(sessionToken);
    } catch(err){
        console.log(err);
        res.json(err)
    }
})

app.post("/test", authMiddleware ,(req,res)=>{
    res.json('IT WORKED, THIS USER IS AUTHENTICATED');
})

app.listen(3001,()=>{
    console.log("server is running");
});