import { connect } from 'mongoose';
import config from './config';
import App from './App';
import 'colors';

// Importaciones de controladores
import CatalogosController from './api/catalogos/Catalogos.controller';
import UsuariosController from './api/usuarios/usuarios.controller';
import SetdebController from './api/setdeb/setdeb.controller';
import BitacoraController from './api/bitacora/bitacora.controller';
import MesasController from './api/mesas/Mesas.controller';

console.log('Mode: dev')

// Conexion a Mongo
connect(config.mongo.url)
    .then(result => {
        console.log('Conectado a la base de datos'.green);
    })
    .catch(error => {
        console.error(`${error}`.red);
    });

const path = '/API_SREI';

const app = new App(
    [
        new SetdebController(path),
        new CatalogosController(path),
        new UsuariosController(path),
        new BitacoraController(path),
        new MesasController(path),
    ]
);

app.getApp();

console.log('Servidor iniciado'.green);