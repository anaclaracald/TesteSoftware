const admin = require('firebase-admin');
const serviceAccount = require('../firebaseKey.json'); 

// Inicializa o Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Exporta as instâncias de Firestore e Authentication
const db = admin.firestore();
const auth = admin.auth(); // Adicione auth se for usar autenticação de usuário

module.exports = { db, auth };