const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { uploadPDFToDrive } = require("../services/googleDrive");
const { verifyToken } = require("../middleware/auth"); // já existe no seu projeto

const upload = multer({
  dest: "temp/",
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Somente arquivos PDF são permitidos"));
    }
    cb(null, true);
  },
});

router.post("/upload-pdf-drive", verifyToken, upload.single("pdf"), async (req, res) => {
  try {
    const { path, originalname } = req.file;
    const result = await uploadPDFToDrive(path, originalname);
    fs.unlinkSync(path); // remove o temporário
    res.status(200).json({ message: "Enviado com sucesso", link: result.link });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao enviar PDF" });
  }
});

module.exports = router;
