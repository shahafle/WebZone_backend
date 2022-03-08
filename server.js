const express = require('express');
const expressSession = require('express-session');
const cors = require('cors');
const path = require('path');
const app = express();
const http = require('http').createServer(app);


// Session Setup
const session = expressSession({
    secret: 'coding is amazing',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
})


// Express App Config
app.use(session);
app.use(express.json());


if (process.env.NODE_ENV === 'production') {
    // Express serves static files on production environment
    app.use(express.static(path.resolve(__dirname, 'public')));
} else {
    // Configuring CORS
    const corsOptions = {
        // * Make sure origin contains the URL your FRONTEND is running on *
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://localhost:3000', 'https://127.0.0.1:3000', 'http://localhost:8080', 'http://127.0.0.1:8080'], // 3000 is for react, 8080 is for vue
        credentials: true
    }
    app.use(cors(corsOptions));
}


// Import routes
const wapRoutes = require('./api/wap/wap.routes');
const authRoutes = require('./api/auth/auth.routes');
const { connectSockets } = require('./services/socket.service');


// Use routes
app.use('/api/wap', wapRoutes);
app.use('/api/auth', authRoutes);
connectSockets(http, session);


// Make every server-side-route match the index.html
// so when requesting http://localhost:3030/index.html/wap/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow react-router to take it from there.
app.get('/**', (req, res) => { // /** Means EVERY route
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})


// Logger is used to keep the "record" of actions in the "backend.log" file found inside "logs" folder
const logger = require('./services/logger.service')
const port = process.env.PORT || 3030
http.listen(port, () => {
    logger.info('Server is running on port: ' + port);
})