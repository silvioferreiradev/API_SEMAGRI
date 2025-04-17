/* const express = require("express");
const Municipe = require("../models/Municipe");

const router = express.Router();

// Criar um novo munícipe
router.post("/", async (req, res) => {
    try {
        const municipe = new Municipe(req.body);
        await municipe.save();
        res.status(201).json({ success: true, data: municipe });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});



// Rota para buscar munícipe por CPF
router.get("/", async (req, res) => {
    try {
      const { cpf } = req.query;
      
      if (!cpf) {
        return res.status(400).json({ message: "CPF é obrigatório" });
      }
  
      const municipe = await Municipe.findOne({ cpf });
  
      if (!municipe) {
        return res.status(404).json({ message: "Munícipe não encontrado" });
      }
  
      res.json(municipe);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro no servidor" });
    }
  });

module.exports = router;
 */

const express = require("express");
const Municipe = require("../models/Municipe");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Criar um novo munícipe
router.post("/", async (req, res) => {
    try {
        const municipe = new Municipe(req.body);
        await municipe.save();
        res.status(201).json({ success: true, data: municipe });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Buscar munícipe por CPF
router.get("/", async (req, res) => {
    try {
        const { cpf } = req.query;

        if (!cpf) {
            return res.status(400).json({ message: "CPF é obrigatório" });
        }

        const municipe = await Municipe.findOne({ cpf });

        if (!municipe) {
            return res.status(404).json({ message: "Munícipe não encontrado" });
        }

        res.json(municipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor" });
    }
});

// Adicionar comentário a um munícipe (autenticado)
router.post("/comentario", authMiddleware, async (req, res) => {
    const { cpf, comentario } = req.body;

    if (!cpf || !comentario) {
        return res.status(400).json({ message: "CPF e comentário são obrigatórios." });
    }

    try {
        const municipe = await Municipe.findOne({ cpf });

        if (!municipe) {
            return res.status(404).json({ message: "Munícipe não encontrado." });
        }

        municipe.comentarios.push({ texto: comentario, data: new Date() });
        await municipe.save();

        res.status(200).json({ message: "Comentário adicionado com sucesso.", comentarios: municipe.comentarios });
    } catch (error) {
        console.error("Erro ao adicionar comentário:", error);
        res.status(500).json({ message: "Erro ao adicionar comentário." });
    }
});

module.exports = router;
