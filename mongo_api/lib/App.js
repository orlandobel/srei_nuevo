"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Importaciones necesarias para el funcionamiento de la API
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const config_1 = require("./config");
class App {
    // constructor para creacion de API donde intancia todos los endpoints creados.
    constructor(controllers) {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }
    // inicializa middlewares
    initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(cors({ origin: true }));
        this.app.use(cookieParser());
        this.app.use(morgan('dev'));
        this.setPort();
    }
    // inicializa inicia e instancia los controladores creados
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }
    // coloca el puerto a utilizar para API
    setPort() {
        this.app.set('port', config_1.default.server.port);
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port ', this.app.get('port'));
        });
    }
    // obtiene toda la intancia de APP creada
    getApp() {
        return this.app;
    }
}
exports.default = App;
//# sourceMappingURL=App.js.map