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


// Buscar comentários por categoria
exports.buscarComentariosPorCategoria = async (req, res) => {
  try {
      const { categoria } = req.query;

      // Encontrar municipes que tenham comentários com a categoria especificada
      const municipes = await Municipe.find({ 'comentarios.categoria': categoria });

      // Mapear os resultados para o formato desejado
      const comentariosFiltrados = municipes.flatMap(municipe => {
          return municipe.comentarios
              .filter(comentario => comentario.categoria === categoria)
              .map(comentario => ({
                  nome: municipe.nome,
                  cpf: municipe.cpf,
                  categoria: comentario.categoria,
                  texto: comentario.texto,
              }));
      });

      res.status(200).json(comentariosFiltrados);
  } catch (error) {
      console.error('Erro ao buscar comentários por categoria:', error);
      res.status(500).json({ message: 'Erro ao buscar comentários por categoria', error });
  }
};