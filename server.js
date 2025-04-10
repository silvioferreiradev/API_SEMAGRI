const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// envio para o drive
const multer = require("multer");
//

dotenv.config();
connectDB();

// 

const upload = multer({
    dest: "temp/",
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== "application/pdf") {
        return cb(new Error("Apenas arquivos PDF são permitidos"));
      }
      cb(null, true);
    },
  });
//

// remover?
const uploadRoutes = require('./routes/upload');
app.use('/api', uploadRoutes);

// remover?

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.get("/", (req, res) => {
    res.send("API de Munícipes está rodando!");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));


const municipeRoutes = require("./routes/municipeRoutes");
app.use("/api/municipes", municipeRoutes);

const authRoutes = require('./routes/authRoutes'); //autenticação
app.use('/api/auth', authRoutes);

const pdfDriveRoute = require("./routes/pdfDrive");
app.use("/api", pdfDriveRoute);



