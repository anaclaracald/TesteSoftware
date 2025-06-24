const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db, auth } = require('../config/firebase');

class Usuario {
    constructor(id, nome, email, senhaHash, tipo) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senhaHash = senhaHash;
        this.tipo = tipo; 
    }

    toFirestore() {
        return {
            nome: this.nome,
            email: this.email,
            senhaHash: this.senhaHash,
            tipo: this.tipo
        };
    }

    static fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return new Usuario(snapshot.id, data.nome, data.email, data.senhaHash, data.tipo);
    }

    static async criar(nome, email, senha) {
        try {
            // Verifica se o email já está em uso
            const usuariosRef = db.collection('usuarios');
            const snapshot = await usuariosRef.where('email', '==', email).get();
            if (!snapshot.empty) {
                throw new Error('Email já cadastrado.');
            }

            // Cria o usuário no Firebase Authentication
            const userRecord = await auth.createUser({
                email: email,
                password: senha,
                displayName: nome,
            });

            // Gera o hash da senha para armazenar no Firestore
            const senhaHash = await bcrypt.hash(senha, 10);

            // Armazena informações adicionais no Firestore
            const novoUsuarioRef = await usuariosRef.add({
                id: userRecord.uid, // Armazena o UID do Firebase Auth no Firestore
                nome: nome,
                email: email,
                senhaHash: senhaHash, // Armazena o hash no Firestore (opcional se usar apenas Auth)
                tipo: 'cliente' // Define um tipo padrão ou passe como argumento
            });

            const novoUsuario = new Usuario(novoUsuarioRef.id, nome, email, senhaHash, 'cliente');
            return novoUsuario;
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            if (error.code === 'auth/email-already-in-use') {
                throw new Error('Email já cadastrado no Firebase Authentication.');
            }
            throw new Error(`Erro ao criar usuário: ${error.message}`);
        }
    }

    static async login(email, senha) {
        try {
            // Autentica o usuário usando Firebase Authentication
            const userCredential = await auth.signInWithEmailAndPassword(email, senha);
            const user = userCredential.user;

            // Busca informações adicionais do usuário no Firestore (se necessário)
            const usuariosRef = db.collection('usuarios');
            const snapshot = await usuariosRef.where('email', '==', email).limit(1).get();
            
            let usuarioFirestore = null;
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                usuarioFirestore = new Usuario(doc.id, doc.data().nome, doc.data().email, doc.data().senhaHash, doc.data().tipo);
            } else {
                // Caso não encontre no Firestore, mas encontre no Auth, pode criar um registro básico
                // Ou tratar como erro se o Firestore for a fonte primária de dados do perfil.
                throw new Error("Usuário autenticado, mas dados não encontrados no Firestore.");
            }

            // Gera um token JWT personalizado (se necessário, o Firebase Auth já fornece um token)
            // Se você precisa de claims personalizadas no JWT ou quer um token de sessão, gere aqui.
            // Para este caso, vamos gerar um JWT simples com dados do usuário
            const token = jwt.sign(
                { id: usuarioFirestore.id, email: usuarioFirestore.email, tipo: usuarioFirestore.tipo },
                process.env.JWT_SECRET || 'sua_chave_secreta_jwt', // Use uma variável de ambiente em produção!
                { expiresIn: '1h' }
            );

            return { token, usuario: usuarioFirestore };

        } catch (error) {
            console.error('Erro no login:', error);
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                throw new Error('Email ou senha inválidos.');
            }
            throw new Error(`Erro no login: ${error.message}`);
        }
    }
}

module.exports = Usuario;