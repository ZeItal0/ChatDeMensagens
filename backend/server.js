import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { createServer } from "http";
import { Server } from "socket.io";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend funcionando!");
});

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ message: "email indisponivel." });

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name: username, email, password: hash },
    });

    res.json({ message: "usuario registrado!", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "usuario nao encontrado" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: "senha incorreta" });

    const token = jwt.sign({ id: user.id, username: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Seja bem vindo", token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/message", async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    const msg = await prisma.message.create({
      data: { senderId, receiverId, text: content },
    });

    io.to(receiverId.toString()).emit("new_message", msg);

    res.json(msg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/users/:id", async (req, res) => {
  const currentUserId = Number(req.params.id);
  const users = await prisma.user.findMany({
    where: { NOT: { id: currentUserId } },
    select: { id: true, name: true, email: true },
  });
  res.json(users);
});

app.get("/messages/:u1/:u2", async (req, res) => {
  try {
    const { u1, u2 } = req.params;

    const msgs = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: Number(u1), receiverId: Number(u2) },
          { senderId: Number(u2), receiverId: Number(u1) },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    res.json(msgs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId.toString());
  });

  socket.on("disconnect", () => {});
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
