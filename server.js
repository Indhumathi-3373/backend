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
const corsOptions = require('./corsOptions')
const web=express()
const frontendPath = path.join(__dirname, '..', 'frontend')
const imagesPath = path.join(__dirname, '..', 'frontend', 'public', 'images')

web.use(cors(corsOptions))

web.use(express.json())
web.use(express.urlencoded({extended:true}))
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
web.use('/images', express.static(imagesPath))
web.use(express.static(frontendPath))

web.get('/frontend/session', (req, res) => {
    if (req.session && req.session.user) {
        const user = req.session.user;
        const scopes = Array.isArray(user.scopes)
            ? user.scopes
            : (user.scope ? [user.scope] : []);
        return res.json({ authenticated: true, user: { ...user, scopes } });
    }
    return res.json({ authenticated: false });
});

web.post('/frontend/logout', (req, res) => {
    const scope = req.body?.scope || req.query?.scope;
    if (req.session && req.session.user && scope) {
        const user = req.session.user;
        const scopes = Array.isArray(user.scopes)
            ? user.scopes
            : (user.scope ? [user.scope] : []);
        const nextScopes = scopes.filter((s) => s !== scope);
        if (nextScopes.length > 0) {
            req.session.user = { ...user, scopes: nextScopes };
            return res.json({ message: "Logged out", scopes: nextScopes });
        }
    }
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
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/create_account"
mongoose.connect(mongoUri)
.then(()=>{
    console.log("mongodb connected")
})
.catch((err)=>{
    console.log(err)
})
const port = process.env.PORT || 8000
web.listen(port,()=>{
    console.log(`server listening on ${port}`)
})
