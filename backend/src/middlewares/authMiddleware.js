const admin = require('firebase-admin');
const { auth } = require('../config/firebase'); 

const authMiddleware = async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).send({ message: 'Authorization header is missing.' });
    }

    const token = header.split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: 'Token not provided.' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);

        
        req.usuario = {
            id: decodedToken.uid,
            email: decodedToken.email,
            tipo: decodedToken.tipo || 'cliente' 
        };

        next(); 
    } catch (error) {
        console.error('Error verifying Firebase ID token:', error);
        return res.status(403).send({ message: 'Invalid or expired token.' });
    }
};

module.exports = authMiddleware;