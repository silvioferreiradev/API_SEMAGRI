const mongoose = require("mongoose");

const MunicipeSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    rg: { type: String, required: true },
    pdfId: { type: String },
    endereco: { type: String, required: true },
    numero: { type: String, required: true },
    bairro: { type: String, required: true },
    cep: { type: String, required: true },
    cidade: { type: String, required: true },
    estado: { type: String, required: true },

    comentarios: [
        {
          texto: String,
          data: { type: Date, default: Date.now }
        }
      ]
/*     dap: { type: String, required: true },
    data_nascimento: { type: Date, required: true },
    titulo_eleitor: { type: String, required: true },
    endereco: { type: String, required: true },
    numero: { type: String, required: true },
    bairro: { type: String, required: true },
    cep: { type: String, required: true },
    cidade: { type: String, required: true },
    estado: { type: String, required: true },
    comprovante_residencia: { type: String },
    certidao_nascimento: { type: String },
    certidao_casamento: { type: String },
    bolsa_familia: { type: Boolean, default: false }, */
}, { timestamps: true });

module.exports = mongoose.model("Municipe", MunicipeSchema);
