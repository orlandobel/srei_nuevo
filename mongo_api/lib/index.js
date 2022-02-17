"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = require("./config");
const App_1 = require("./App");
require("colors");
// Importaciones de controladores
const Catalogos_controller_1 = require("./api/catalogos/Catalogos.controller");
const usuarios_controller_1 = require("./api/usuarios/usuarios.controller");
const setdeb_controller_1 = require("./api/setdeb/setdeb.controller");
console.log('Mode: dev');
// Conexion a Mongo
(0, mongoose_1.connect)(config_1.default.mongo.url)
    .then(result => {
    console.log('Conectado a la base de datos'.green);
})
    .catch(error => {
    console.error(`${error}`.red);
});
const path = '/API_SREI';
const app = new App_1.default([
    new setdeb_controller_1.default(path),
    new Catalogos_controller_1.default(path),
    new usuarios_controller_1.default(path),
]);
app.getApp();
console.log('Servidor iniciado'.green);
//# sourceMappingURL=index.js.map