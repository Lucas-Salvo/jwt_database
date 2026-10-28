import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {prisma} from "./lib/prisma.ts";
import cookieParser from "cookie-parser";

const app = express()
const PORT = 3000

app.use(express.json())
app.use(cors())
app.use(cookieParser())    

    function autenticarUsuario(req, res, next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message: "Token negado"})
        }
    try{
    const usuario = jwt.verify(token, JWT_SECRET);
    req.usuario = usuario;
    next();
    }catch(error){
        return res.status(403).json({message: "token invalido ou expirado"})
    }
}

app.get("/usuario", async (req, res) => {
    const get = await prisma.usuario.findMany()
    res.json(get)
})

app.post("/register", async (req, res) => {
    const {nome, email, senha, cpf} = req.body

    const salt = await bcrypt.genSalt(10)
    const senhaHash = await bcrypt.hash(senha, salt)
    const cpfHash = await bcrypt.hash(cpf, salt)

    const registro = await prisma.usuario.create({
        data: {
            nome,
            email,
            senha: senhaHash,
            cpf: cpfHash
        }
    })
    res.json(registro)
})

app.post("/login", async (req, res) => {
    const {nome, email, senha, cpf} = req.body

    const token = jwt.sign({id:Cliente.id}),
    JWT_SECRET, { expiresIn: "1h" },

    res.cookie("token", token, {
      httpOnly: true, // O código JavaScript do front NÃO consegue ler o cookie (proteção XSS)
      secure: false, // Mude para true em produção (HTTPS)
      sameSite: "lax", // Proteção contra CSRF
      maxAge: 3600000, // Expira em 1 hora (em ms)
    });


    const registro = await prisma.usuario.create({
        where: {}
    })
    res.json(registro)
})

app.get("/faturamento", autenticarUsuario, async(req, res) => {
    res.json({message: "Minha fatura"})
})

app.listen(PORT, () => {
    console.log("API rodando")
})