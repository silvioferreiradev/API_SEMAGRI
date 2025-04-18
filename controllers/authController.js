const jwt = require('jsonwebtoken');
const User = require('../models/User');

const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(senha))) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    const token = gerarToken(user._id);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

exports.registrar = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const usuario = await User.create({ nome, email, senha });
    const token = gerarToken(usuario._id);
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao criar usuário' });
  }
};
