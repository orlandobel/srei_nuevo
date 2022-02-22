"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const codigos_1 = require("../../exceptions/codigos");
const InternalServerException_1 = require("../../exceptions/InternalServerException");
const DataNotFoundException_1 = require("../../exceptions/DataNotFoundException");
const EQP_interface_1 = require("../../interfaces/collections/EQP.interface");
const fs = require("fs");
const QRCode = require('qrcode');
class CatalogoCM {
    constructor() {
        /*
         * Obtencion de un equipo en especifico
         * @param equipo: _id del equipo que se ésta buscando
         * @returns DataNotFoundException si "equipo" no fue proporcionado o si no se encontró el registro en la base de datos
         * @returns InternalServerException si ocurre algún error inesérado en la ejecución de la consulta
         * @returns Equipo si el registro fue encontrado en la base de datos
        */
        this.obtenerEquipo = (equipo) => __awaiter(this, void 0, void 0, function* () {
            if (equipo === undefined || equipo === null || equipo === '') {
                return new DataNotFoundException_1.default(codigos_1.codigos.datoNoEncontrado);
            }
            try {
                const registro = yield EQP_interface_1.default.findById(equipo).exec();
                if (registro === null || registro === undefined)
                    return new DataNotFoundException_1.default(codigos_1.codigos.identificadorInvalido);
                return registro;
            }
            catch (error) {
                console.log(`Error al obtener equipo: ${error}`.red);
                return new InternalServerException_1.default(codigos_1.codigos.indefinido, error);
            }
        });
        /*
         * Obtencion de una lista de equipo dependiendo del laboratorio que este budcando y el tipo de equipo que se ésta buscando
         * @param tipo: tipo de equipo (electronica, maequinaria, etc.)
         * @param laboratoeio: id del laboratorio en el que se encuentra almacenado el equipo
         * @returns DataNotFoundException si "tipo" ó "laboratorio" no fue proporcionado o si no se encontró el registro en la base de datos
         * @returns InternalServerException si ocurre algún error inesérado en la ejecución de la consulta
         * @returns Equipo[] si se encontraron registros en la base de datos
        */
        this.obtenerEquipoTipo = (tipo, laboratorio) => __awaiter(this, void 0, void 0, function* () {
            if (tipo === undefined || tipo === null || tipo === '')
                return new DataNotFoundException_1.default(codigos_1.codigos.informacionNoEnviada);
            if (laboratorio === undefined || laboratorio === null || laboratorio === '')
                return new DataNotFoundException_1.default(codigos_1.codigos.informacionNoEnviada);
            try {
                console.log({ tipo, laboratorio });
                const registros = yield EQP_interface_1.default.find({ tipo, laboratorio }).exec();
                if (registros === null || registros === undefined)
                    return new DataNotFoundException_1.default(codigos_1.codigos.datosNoEncontrados);
                const elements = registros;
                return elements;
            }
            catch (error) {
                console.log(`Error al consultar por tipo: ${error}`.red);
                return new InternalServerException_1.default(codigos_1.codigos.indefinido, error);
            }
        });
        this.obtenerImagen = (ruta) => __awaiter(this, void 0, void 0, function* () {
            if (ruta === null || ruta === undefined || ruta === '')
                return new DataNotFoundException_1.default(codigos_1.codigos.indefinido);
            try {
                const fsPromise = fs.promises;
                const file = yield fsPromise.readFile(`./storage/${ruta}`, { encoding: 'base64' });
                return file;
            }
            catch (error) {
                console.log(`Error al buscar la imagen: ${error}`.red);
                return new DataNotFoundException_1.default(codigos_1.codigos.datoNoEncontrado);
            }
        });
        /*
         * Crea un nuevo equipo en la base de datos junto con la creación y almacenamiento del respectivo código QR
         * @param equipo: objeto con las caracteristicas minimas necesarias para crear un equipo segun la interfaz
         * @param laboratorio: nombre del laboratorio al que pertenece el equipo, se usa para la creación del código QR
         * @returns DataNotFoundException si "equipo" o "laboratorio" no fueron proporcionados
         * @returns InternalServerException si ocurre algún error al crear el QR o guardar el registro en base de datos
         * @returns { eqp: Equipo, ruta: String } si la creacion resulto con exito
        */
        this.crearEquipo = (equipo, laboratorio) => __awaiter(this, void 0, void 0, function* () {
            if (equipo === null || equipo === undefined)
                return new DataNotFoundException_1.default(codigos_1.codigos.informacionNoEnviada);
            try {
                const eqp = yield EQP_interface_1.default.create(equipo);
                const id = eqp._id;
                const ruta = this.generarRuta(laboratorio, equipo.tipo, id);
                const qr_data = {
                    id,
                    nombre: equipo.nombre,
                    laboratorio,
                };
                const qr = yield this.generarQr(qr_data, ruta);
                if (qr instanceof InternalServerException_1.default) {
                    yield eqp.delete();
                    return qr;
                }
                yield EQP_interface_1.default.updateOne({ _id: id }, { path: ruta }, { new: true });
                return { eqp, ruta };
            }
            catch (error) {
                console.log(`Error al crear equipo: ${error}`.red);
                return new InternalServerException_1.default(codigos_1.codigos.indefinido, error);
            }
        });
        /*
         * Almacena la imágen de un equipo en el servidor
         * @params img: imágen del equipo que se almacenará en el servidor
         * @params ruta: ruta en la que se almacenará la imágen
         * @returns InternalServerException si lo parametros no son proporcionados o si ocurre algun erro al guarda la imágen
         * @returns void si la imágen se gaurda correctamente
        */
        this.subirImagen = (img, ruta) => __awaiter(this, void 0, void 0, function* () {
            // Verificación de datos nulos
            if (img === undefined || img === null) {
                return new InternalServerException_1.default(codigos_1.codigos.indefinido);
            }
            if (ruta === undefined || ruta === null || ruta === '')
                return new InternalServerException_1.default(codigos_1.codigos.indefinido);
            const extension = img.mimetype.split('/')[1];
            try {
                const fsPromise = fs.promises;
                ruta = `./storage/${ruta}`;
                if (!fs.existsSync(ruta)) {
                    console.log('creando');
                    fs.mkdirSync(ruta, { recursive: true });
                }
                yield fsPromise.writeFile(`${ruta}/imagen.${extension}`, img.buffer, 'binary');
            }
            catch (error) {
                console.log(`error al guardar la imagen: ${error}`.red);
                return new InternalServerException_1.default(codigos_1.codigos.indefinido, error);
            }
        });
        /* Generación del código QR para el equpo */
        this.generarQr = (qr_data, ruta) => __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(qr_data);
            try {
                // Directorio destinado a guardar los archivos relacionados con el equipo
                ruta = `./storage/${ruta}`;
                // Si el directorio anterior no existe lo crea de manera recursiva
                if (!fs.existsSync(ruta))
                    fs.mkdirSync(ruta, { recursive: true });
                // Crea el código QR y lo almacena en una imagen en el directorio desiggando
                yield QRCode.toFile(`${ruta}/qr.png`, data, { color: { dark: "#000", light: "#FFF" } });
            }
            catch (err) {
                console.error(err);
                return new InternalServerException_1.default(codigos_1.codigos.indefinido, err);
            }
        });
        /* Generación de la ruta para almacenar las imágnes de un equipo */
        this.generarRuta = (laboratorio, tipo, id) => {
            const lab_split = laboratorio.split(' ');
            const lab = lab_split[0].toLowerCase() + lab_split[1];
            tipo = tipo.toLowerCase();
            if (tipo.split(' ').length > 1) {
                const tipo_split = tipo.split(' ');
                tipo = tipo_split[0] + '_' + tipo_split[1];
            }
            return `${lab}/${tipo}/${id}`;
        };
        /*
         * Edición de la informació de un equipo en base de datos
         * @param equipo: Objeto con la informacion que se guardará al editar el equpo, así como el _id para su busqueda
         * @returns DataNotFoundException si la información del equipo no fue envíada o si el equipo no es encontró en la base de datos
         * @returns InternalServerException si ocurre algun error en la acutalización
         * @returns Equipo si se el equipo se actualizó con exito
        */
        this.editarEquipo = (equipo) => __awaiter(this, void 0, void 0, function* () {
            if (equipo === null || equipo === undefined)
                return new DataNotFoundException_1.default(codigos_1.codigos.informacionNoEnviada);
            const _id = equipo._id;
            try {
                const edited = yield EQP_interface_1.default.findOneAndUpdate({ _id }, { $set: equipo }, { new: true });
                if (edited === null || edited === undefined)
                    return new DataNotFoundException_1.default(codigos_1.codigos.datoNoEncontrado);
                return edited;
            }
            catch (error) {
                console.log(`Error al editar equipo: ${error}`.red);
                return new InternalServerException_1.default(codigos_1.codigos.indefinido, error);
            }
        });
        /*
         * Eliminación de un equipo del a base de datos así como de sus archivos en el servidor
         * @param _id: _id del equipo que se va a eliminar de la base de datos
         * @param ruta: ruta en la que se almacenan los archivos del equipo para su eliminación
         * @returns DataNotFoundException si alguno de los parametros no fue envíado o si no se encontró el equipo a eliminar
         * @returns InternalServerException si ocurrio algun error al eliminar el equipo o sus archivos
         * @returns void si se elimino con exito
        */
        this.eliminarEquipo = (_id, ruta) => __awaiter(this, void 0, void 0, function* () {
            if (_id === null || _id === undefined)
                return new DataNotFoundException_1.default(codigos_1.codigos.informacionNoEnviada);
            try {
                const eliminado = yield EQP_interface_1.default.deleteOne({ _id });
                if (eliminado === null || eliminado === undefined)
                    return new InternalServerException_1.default(codigos_1.codigos.indefinido);
                if (eliminado.deletedCount < 1)
                    return new DataNotFoundException_1.default(codigos_1.codigos.datoNoEncontrado);
                yield this.eliminarFolder(ruta);
            }
            catch (error) {
                console.log(typeof (error));
                console.log(`Error al eliminar equipo: ${error}`.red);
                return new InternalServerException_1.default(codigos_1.codigos.indefinido, error);
            }
        });
        /* Eliminacion de la carpeta de archivos de algún equipo */
        this.eliminarFolder = (dir) => __awaiter(this, void 0, void 0, function* () {
            try {
                const fsPromise = fs.promises;
                yield fsPromise.rm(`./storage/${dir}`, { recursive: true });
            }
            catch (error) {
                console.error(`error al eliminar los archivos: ${error}`.red);
                return new InternalServerException_1.default(codigos_1.codigos.indefinido, error);
            }
        });
    }
}
exports.default = CatalogoCM;
//# sourceMappingURL=Catalogos.CM.js.map