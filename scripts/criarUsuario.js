// scripts/criarUsuario.js
const mongoose = require("mongoose");
const User = require("../models/User"); // ajuste o caminho se necessário

const uri = "mongodb+srv://jssilvioferreira:39256516@cluster0.wvnqve4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri).then(async () => {
  const novoUsuario = new User({
    nome: "admin",
    email: "admin@semagri.com.br",
    senha: "1234",
    role: "admin"
  });

  await novoUsuario.save();
  console.log("✅ Usuário criado com sucesso!");
  mongoose.disconnect();
}).catch((err) => {
  console.error("❌ Erro ao conectar ao MongoDB:", err);
});
