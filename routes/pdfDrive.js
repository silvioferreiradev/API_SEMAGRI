const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { uploadPDFToDrive } = require("../services/googleDrive");
const verifyToken = require("../middleware/authMiddleware");
const Municipe = require("../models/Municipe"); // IMPORTANTE

// Configuração do multer para upload temporário
const upload = multer({
  dest: "temp/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Somente arquivos PDF são permitidos"));
    }
    cb(null, true);
  },
});

// Rota de upload e atualização do pdfId no MongoDB
router.post("/upload-pdf-drive", verifyToken, upload.single("pdf"), async (req, res) => {
  try {
    const { path, originalname } = req.file;
    const { cpf } = req.body;

    if (!cpf) {
      return res.status(400).json({ error: "CPF é obrigatório no corpo da requisição." });
    }

    // Nomeia o arquivo no Drive como "<cpf>.pdf"
    const filename = `${cpf}.pdf`;
    const result = await uploadPDFToDrive(path, filename);
    fs.unlinkSync(path); // Remove o arquivo temporário

    // Atualiza o munícipe com o pdfId
    const updated = await Municipe.findOneAndUpdate(
      { cpf },
      { pdfId: result.id },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Munícipe não encontrado com o CPF fornecido." });
    }

    // Retorna o ID e link do arquivo no Google Drive
    res.status(200).json({
      message: "PDF enviado e vinculado com sucesso.",
      pdfId: result.id,
      link: `https://drive.google.com/file/d/${result.id}/view?usp=sharing`,
    });

  } catch (err) {
    console.error("Erro ao enviar PDF:", err);
    res.status(500).json({ error: "Erro ao processar upload do PDF." });
  }
});

module.exports = router;
