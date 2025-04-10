
const { google } = require("googleapis");
const fs = require("fs");

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

async function uploadPDFToDrive(filePath, filename) {
  const fileMetadata = {
    name: filename,
    mimeType: "application/pdf",
  };

  const media = {
    mimeType: "application/pdf",
    body: fs.createReadStream(filePath),
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: "id",
  });

  await drive.permissions.create({
    fileId: response.data.id,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  const link = `https://drive.google.com/uc?id=${response.data.id}&export=download`;
  return { id: response.data.id, link };
}

module.exports = uploadPDFToDrive;
