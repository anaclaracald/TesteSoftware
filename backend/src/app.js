const express = require("express")
const admin = require("firebase-admin")
const cors = require("cors")
const path = require("path");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const app = express()

app.use(cors());
app.use(express.json())
app.use(express.static(path.join(__dirname, "../../frontend")));

const serviceAccount = require("./firebaseKey.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()
const usuariosCollection = db.collection("usuarios")

// log routes
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
});

// cadastro
app.post("/usuarios", async (req, res) => {
    const { nome, email, senha } = req.body

    try {
        const snapshot = await usuariosCollection.where("email", "==", email).get()
        if (!snapshot.empty) {
            return res.status(400).json({ message: "Email já cadastrado" })
        }

        const senhaHash = await bcrypt.hash(senha, 10)
        const novoUsuario = await usuariosCollection.add({ nome, email, senha: senhaHash})
        res.status(201).json({ message: "Usuário cadastrado com sucesso", id: novoUsuario.id })
    }
    catch (error) {
        console.error("Erro de cadastro.", error)
        res.status(500).json({ error: error.message })
    }
})

// login
app.post("/login", async (req, res) => {
    const { email, senha } = req.body

    try {
        const snapshot = await usuariosCollection.where("email", "==", email).get()

        if (snapshot.empty) {
            return res.status(401).json({ message: "Email ou senha inválidos." })
        }

        const doc = snapshot.docs[0]
        const userData = doc.data()

        const senhaCorreta = await bcrypt.compare(senha, userData.senha)
        if (!senhaCorreta) {
            return res.status(401).json({ message: "Email ou senha inválidos." })
        }

        const token = jwt.sign({ id: doc.id, email: userData.email }, "vC+dtfWWK@j?tn5CUo-t#,A,7Ufq48h9m2%Ece}}!Jh-d9.+VV4s8t)Y7MiY5?*,", { expiresIn: "1h" })

        res.json({ message: "Login bem-sucedido", token })

    } catch (error) {
        console.error("Erro no login:", error)
        res.status(500).json({ error: error.message })
    }
})

// rota protegida
app.get("/me", autenticarToken, (req, res) => {
    res.json({ id: req.user.id, email: req.user.email })
})

// middleware para verificar token
function autenticarToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(401).json({ message: "Token não fornecido" })
    
    jwt.verify(token, "vC+dtfWWK@j?tn5CUo-t#,A,7Ufq48h9m2%Ece}}!Jh-d9.+VV4s8t)Y7MiY5?*,", (err, user) => {
        if (err) return res.status(403).json({ message: "Token inválido" })
        req.user = user
        next()
    })
}

// Rota da página inicial: redireciona para a página de login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/login.html"))
});

// inicializar servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})
