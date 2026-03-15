const express=require('express')
const mongoose=require('mongoose')
const router=require('./routes')
const logindiary=require('./loginroutes')
const logindoc=require('./logindoc')
const diaryroutes=require('./diaryroutes')
const documentroutes=require('./documentroutes')
const feedbackroutes=require('./feedbackroutes')
const path=require('path')
const cors=require('cors')
const session=require('express-session')
const sessionTracker = require('./sessionTracker')
const users = require('./models_db/users')
const Diary = require('./models_db/diary')
const Document = require('./models_db/document')
const Feedback = require('./models_db/feedback')
const web=express()
web.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    credentials: true
}))

web.use(express.json())
web.use(express.urlencoded({extend:true}))
//session handled here
web.use(session({
    secret: process.env.SESSION_SECRET || "dev_secret_change_me",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 1000 * 60 * 60 * 24*7
    }
}))
web.use('/frontend', router);
web.use('/frontend', logindiary); 
web.use('/frontend', logindoc);
web.use('/frontend', diaryroutes);
web.use('/frontend', documentroutes);
web.use('/frontend', feedbackroutes);
web.use('/uploads', express.static(path.join(__dirname, 'uploads')));

web.get('/frontend/session', (req, res) => {
    if (req.session && req.session.user) {
        return res.json({ authenticated: true, user: req.session.user });
    }
    return res.json({ authenticated: false });
});

web.post('/frontend/logout', (req, res) => {
    sessionTracker.remove(req.sessionID);
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.json({ message: "Logged out" });
    });
});

web.get('/frontend/admin/stats', async (req, res) => {
    try {
        const [userCount, diaryCount, documentCount, feedbackCount] = await Promise.all([
            users.countDocuments(),
            Diary.countDocuments(),
            Document.countDocuments(),
            Feedback.countDocuments()
        ]);
        res.json({
            users: userCount,
            diaries: diaryCount,
            documents: documentCount,
            feedback: feedbackCount,
            activeSessions: sessionTracker.count()
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to load stats" });
    }
});
mongoose.connect("mongodb://localhost:27017/create_account")
.then(()=>{
    console.log("mongodb connected")
})
.catch((err)=>{
    console.log(err)
})
web.listen((8000),()=>{
    console.log("server listening")
})
