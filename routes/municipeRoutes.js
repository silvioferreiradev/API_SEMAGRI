const express = require("express");
const Municipe = require("../models/Municipe");
const authMiddleware = require("../middleware/authMiddleware");
const municipeController = require('../controllers/municipeController');
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
    const { cpf, comentario , categoria } = req.body;

    console.log("Comentário recebido:", req.body);

    // Validação: CPF, comentário e categoria são obrigatórios
    if (!cpf || !comentario  || !categoria ) {
        return res.status(400).json({ message: "CPF, comentário e categoria são obrigatórios." });
    }

     // Se a categoria não for fornecida, atribui 'OUTROS'
        const categoriaFinal = categoria || 'OUTROS'; 

    try {
        // Encontre o munícipe pelo CPF
        const municipe = await Municipe.findOne({ cpf });

        console.log("Munícipe encontrado:", municipe);

        if (!municipe) {
            return res.status(404).json({ message: "Munícipe não encontrado." });
        }

        // Adicionar o comentário com a categoria
 

        console.log("Antes de salvar, municipe:", municipe);
        municipe.comentarios.push({ texto: comentario, categoria: categoriaFinal, data: new Date() });
        await municipe.save();


        // Buscando comentário por categoria

        router.get('/comentarios/categoria', municipeController.buscarComentariosPorCategoria);


        // Resposta de sucesso
        res.status(200).json({ message: "Comentário adicionado com sucesso.", comentarios: municipe.comentarios });
    } catch (error) {
        console.error("Erro ao adicionar comentário:", error);
        res.status(500).json({ message: "Erro ao adicionar comentário." });
    }
});


module.exports = router;
