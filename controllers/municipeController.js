// controllers/municipeController.js

const Municipe = require('../models/Municipe');

// Criar novo munícipe
exports.criarMunicipe = async (req, res) => {
  try {
    const municipe = await Municipe.create(req.body);
    res.status(201).json(municipe);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao cadastrar munícipe', error });
  }
};

// Listar todos os munícipes
exports.listarMunicipes = async (req, res) => {
  try {
    const municipes = await Municipe.find();
    res.status(200).json(municipes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar munícipes', error });
  }
};

// Buscar por CPF
exports.buscarPorCpf = async (req, res) => {
  try {
    const { cpf } = req.query;
    const municipe = await Municipe.findOne({ cpf });

    if (!municipe) {
      return res.status(404).json({ message: 'Munícipe não encontrado' });
    }

    res.status(200).json(municipe);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar munícipe', error });
  }
};