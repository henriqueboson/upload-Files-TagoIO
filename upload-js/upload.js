const fs = require("fs");
const path = require("path");
const { Files } = require("@tago-io/sdk");
require("dotenv").config();
const inquirer = require("inquirer");

const TAGO_TOKEN = process.env.TAGO_TOKEN;

async function main() {
  if (!TAGO_TOKEN) {
    console.error("Token não encontrado no .env");
    return;
  }

  const answers = await inquirer.default.prompt([
    {  
      type: "input",
      name: "filePath",
      message: "Digite o caminho do arquivo para upload:",
      validate: (input) => {
        if (!fs.existsSync(input)) return "Caminho inválido.";
        if (fs.lstatSync(input).isDirectory()) return "Você escolheu uma pasta. Por favor, selecione um arquivo.";
        return true;
      }
    },
  ]);  

  const filePath = answers.filePath;
  const absolutePath = path.resolve(filePath);
  const buffer = fs.readFileSync(absolutePath);
  const fileName = path.basename(filePath);
  const files = new Files({ token: TAGO_TOKEN });

  try {

    const result = await files.upload({
    filename: fileName,
    file: buffer,
    public: true,
    });

    console.log("Upload feito com sucesso!");
    console.log("Nome:", result.filename);
    console.log("URL:", result.url);
  } catch (error) {
    console.error("Erro ao enviar:");
    if (error.response?.data) {
        console.error(error.response.data);
    } else {
        console.error(error.message || error);
    }
  }
}

main();
