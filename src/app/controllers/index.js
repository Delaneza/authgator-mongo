const fs = require('fs')
const path = require('path')

module.exports = app => {
    fs
        .readdirSync(__dirname) // Ler diretório
        .filter(file => ((file.indexOf('.')) !== 0 && (file !== "index.js"))) // Filtrar arquivos que não iniciam em ponto e não seja index.js
        .forEach(file => require(path.resolve(__dirname, file))(app))
}