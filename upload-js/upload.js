const fs = require("fs");
const path = require("path");
const { Utils } = require("@tago-io/sdk");
require("dotenv").config();
const inquirer = require("inquirer");

const TAGO_TOKEN = process.env.TAGO_TOKEN;

async function main() {
  if (!TAGO_TOKEN) {
    console.error("Token não encontrado no .env");
    return;
  }

  const { filePath } = await inquirer.prompt([
    {
      type: "input",
      name: "filePath",
      message: "Digite o caminho do arquivo para upload:",
      validate: (input) => fs.existsSync(input) || "Arquivo não encontrado.",
    },
  ]);

  const absolutePath = path.resolve(filePath);
  const buffer = fs.readFileSync(absolutePath);
  const fileName = path.basename(filePath);

  try {
    const result = await Utils.files.upload(
      {
        filename: fileName,
        file: buffer,
        public: true, // ou false, se quiser privado
      },
      TAGO_TOKEN
    );

    console.log("Upload feito com sucesso!");
    console.log("Nome:", result.filename);
    console.log("URL:", result.url);
  } catch (error) {
    console.error("Erro ao enviar:", error.response?.data || error.message);
  }
}

main();
