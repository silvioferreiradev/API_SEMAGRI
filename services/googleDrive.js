const fs = require("fs");
const { google } = require("googleapis");
const path = require("path");

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "../config/credentials.json"),
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

async function uploadPDFToDrive(filePath, filename) {
  const fileMetadata = {
    name: filename,
    mimeType: "application/pdf",
    parents: ["1CXxUI6XpH7r0rY_340I8ogBx_n_3Nd5J"], // ID da pasta no Drive
  };

  const media = {
    mimeType: "application/pdf",
    body: fs.createReadStream(filePath),
  };

  const file = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: "id",
    supportsAllDrives: true,
    uploadType: "resumable",
  });

  // NÃO define permissão pública. Somente a conta do service account terá acesso.

  return {
    id: file.data.id,
    message: "Arquivo enviado com sucesso. Acesso restrito ao service account.",
  };
}

module.exports = { uploadPDFToDrive };
