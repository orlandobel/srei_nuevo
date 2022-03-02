import { codigos } from '../../exceptions/codigos';

import InternalServerException from '../../exceptions/InternalServerException';
import DataNotFoundException from '../../exceptions/DataNotFoundException';

import EQP, { Equipo } from '../../interfaces/collections/EQP.interface';
import LAB, { Laboratorio } from '../../interfaces/collections/LAB.interface';
import autoTable, { CellInput } from 'jspdf-autotable';

import fs = require('fs');
import { copyFile } from 'fs';
import path = require('path');

const QRCode = require('qrcode');
const { jsPDF } = require("jspdf");


class CatalogoCM {
    /*
     * Obtencion de un equipo en especifico
     * @param equipo: _id del equipo que se ésta buscando
     * @returns DataNotFoundException si "equipo" no fue proporcionado o si no se encontró el registro en la base de datos
     * @returns InternalServerException si ocurre algún error inesérado en la ejecución de la consulta
     * @returns Equipo si el registro fue encontrado en la base de datos
    */
    public obtenerEquipo = async (equipo: string): Promise<any> => {
        if(equipo === undefined || equipo === null || equipo === '') {
            return new DataNotFoundException(codigos.datoNoEncontrado);
        }

        try {
            const registro = await EQP.findById(equipo).exec();

            if(registro === null || registro === undefined) 
                return new DataNotFoundException(codigos.identificadorInvalido);

            return registro as Equipo;
        } catch(error) {
            console.log(`Error al obtener equipo: ${error}`.red);
            return new InternalServerException(codigos.indefinido, error);
        }
    }

    /*
     * Obtencion de una lista de equipo dependiendo del laboratorio que este budcando y el tipo de equipo que se ésta buscando
     * @param tipo: tipo de equipo (electronica, maequinaria, etc.)
     * @param laboratoeio: id del laboratorio en el que se encuentra almacenado el equipo
     * @returns DataNotFoundException si "tipo" ó "laboratorio" no fue proporcionado o si no se encontró el registro en la base de datos
     * @returns InternalServerException si ocurre algún error inesérado en la ejecución de la consulta
     * @returns Equipo[] si se encontraron registros en la base de datos
    */
    public obtenerEquipoTipo = async (tipo: string, laboratorio: string): Promise<any> => {
        if(tipo === undefined || tipo === null || tipo === '') 
            return new DataNotFoundException(codigos.informacionNoEnviada);
        
        if(laboratorio === undefined || laboratorio === null || laboratorio === '') 
            return new DataNotFoundException(codigos.informacionNoEnviada);

        try {
            console.log({tipo, laboratorio});
            const registros = await EQP.find({tipo, laboratorio}).exec()
            
            if(registros === null || registros === undefined)
                return new DataNotFoundException(codigos.datosNoEncontrados);

            const elements = registros as Equipo[];

            return elements;
        } catch(error) {
            console.log(`Error al consultar por tipo: ${error}`.red);
            return new InternalServerException(codigos.indefinido, error);
        }
    }

    public obtenerImagen = async(ruta: string): Promise<any> => {
        if(ruta === null || ruta === undefined || ruta === '')
            return new DataNotFoundException(codigos.indefinido)

        try {
            const fsPromise = fs.promises;
            const file = await fsPromise.readFile(`./storage/${ruta}`, { encoding: 'base64' });
            
            return file;
        } catch(error) {
            console.log(`Error al buscar la imagen: ${error}`.red);
            return new DataNotFoundException(codigos.datoNoEncontrado)
        }
    }

    /*
     * Crea un nuevo equipo en la base de datos junto con la creación y almacenamiento del respectivo código QR
     * @param equipo: objeto con las caracteristicas minimas necesarias para crear un equipo segun la interfaz
     * @param laboratorio: nombre del laboratorio al que pertenece el equipo, se usa para la creación del código QR
     * @returns DataNotFoundException si "equipo" o "laboratorio" no fueron proporcionados
     * @returns InternalServerException si ocurre algún error al crear el QR o guardar el registro en base de datos
     * @returns { eqp: Equipo, ruta: String } si la creacion resulto con exito
    */
    public crearEquipo = async (equipo: Equipo, laboratorio: string): Promise<any> => {
        if(equipo === null || equipo === undefined)
            return new DataNotFoundException(codigos.informacionNoEnviada)

        try {
            const eqp = await EQP.create(equipo);

            const id = eqp._id;
            const ruta = this.generarRuta(laboratorio, equipo.tipo, id);
            
            const qr_data = {
                id,
                nombre: equipo.nombre,
                laboratorio,
            }

            const qr = await this.generarQr(qr_data, ruta);

            if(qr instanceof InternalServerException) {
                await eqp.delete()
                return qr;
            }

            await EQP.updateOne({_id: id}, {path: ruta}, { new: true });

            return { eqp, ruta };
        } catch(error) {
            console.log(`Error al crear equipo: ${error}`.red);
            return new InternalServerException(codigos.indefinido, error);
        }
    }

    /* 
     * Almacena la imágen de un equipo en el servidor
     * @params img: imágen del equipo que se almacenará en el servidor
     * @params ruta: ruta en la que se almacenará la imágen
     * @returns InternalServerException si lo parametros no son proporcionados o si ocurre algun erro al guarda la imágen
     * @returns void si la imágen se gaurda correctamente
    */
    public subirImagen = async (img: any, ruta: string): Promise<any> => {
        // Verificación de datos nulos
        if(img === undefined || img === null) {
            return new InternalServerException(codigos.indefinido);
        }

        if(ruta === undefined || ruta === null || ruta === '') 
            return new InternalServerException(codigos.indefinido);

        const extension = img.mimetype.split('/')[1]
        try {
            const fsPromise = fs.promises;
            ruta = `./storage/${ruta}`

            if(!fs.existsSync(ruta)) {
                console.log('creando');
                fs.mkdirSync(ruta, { recursive: true });
            }

            await fsPromise.writeFile(`${ruta}/imagen.${extension}`, img.buffer, 'binary')
        } catch(error) {
            console.log(`error al guardar la imagen: ${error}`.red);
            return new InternalServerException(codigos.indefinido, error);
        }
    }

    /* Generación del código QR para el equpo */
    private generarQr = async (qr_data: Object, ruta: string): Promise<any> => {
        const data = JSON.stringify(qr_data);

        try { 
            // Directorio destinado a guardar los archivos relacionados con el equipo
            ruta = `./storage/${ruta}`
            
            // Si el directorio anterior no existe lo crea de manera recursiva
            if(!fs.existsSync(ruta)) 
                fs.mkdirSync(ruta, { recursive: true });
            
            // Crea el código QR y lo almacena en una imagen en el directorio desiggando
            await QRCode.toFile(`${ruta}/qr.png`, data, { color: {dark: "#000",light: "#FFF"} });
        } catch(err){
            console.error(err);
            return new InternalServerException(codigos.indefinido, err);
        }
    }

    /* Generación de la ruta para almacenar las imágnes de un equipo */
    private generarRuta = (laboratorio: string, tipo: string, id: string): string => {
        const lab_split = laboratorio.split(' ');        
        const lab = lab_split[0].toLowerCase()+lab_split[1];
        
        tipo = tipo.toLowerCase();
        if(tipo.split(' ').length > 1) {
            const tipo_split = tipo.split(' ');
            tipo = tipo_split[0]+'_'+tipo_split[1];
        }

        return `${lab}/${tipo}/${id}`;
    }

    /* 
     * Edición de la informació de un equipo en base de datos
     * @param equipo: Objeto con la informacion que se guardará al editar el equpo, así como el _id para su busqueda
     * @returns DataNotFoundException si la información del equipo no fue envíada o si el equipo no es encontró en la base de datos
     * @returns InternalServerException si ocurre algun error en la acutalización
     * @returns Equipo si se el equipo se actualizó con exito
    */
    public editarEquipo = async (equipo: Equipo): Promise<any> => {
        if(equipo === null || equipo === undefined) 
            return new DataNotFoundException(codigos.informacionNoEnviada);

        const _id = equipo._id;

        try {
            const edited = await EQP.findOneAndUpdate({_id}, { $set: equipo }, { new: true });

            if(edited === null || edited === undefined)
                return new DataNotFoundException(codigos.datoNoEncontrado);

            return edited
        } catch(error) {
            console.log(`Error al editar equipo: ${error}`.red);
            return new InternalServerException(codigos.indefinido, error);
        }        
    }

    /* 
     * Eliminación de un equipo del a base de datos así como de sus archivos en el servidor
     * @param _id: _id del equipo que se va a eliminar de la base de datos
     * @param ruta: ruta en la que se almacenan los archivos del equipo para su eliminación
     * @returns DataNotFoundException si alguno de los parametros no fue envíado o si no se encontró el equipo a eliminar
     * @returns InternalServerException si ocurrio algun error al eliminar el equipo o sus archivos
     * @returns void si se elimino con exito
    */
    public eliminarEquipo = async (_id: string, ruta: string): Promise<any> => {
        if(_id === null || _id === undefined)
            return new DataNotFoundException(codigos.informacionNoEnviada);

        try {
            const eliminado = await EQP.deleteOne({_id})

            if(eliminado === null || eliminado === undefined)
                return new InternalServerException(codigos.indefinido);

            if(eliminado.deletedCount < 1)
                return new DataNotFoundException(codigos.datoNoEncontrado)

            await this.eliminarFolder(ruta)

        } catch(error) {
            console.log(typeof(error));
            console.log(`Error al eliminar equipo: ${error}`.red);
            return new InternalServerException(codigos.indefinido, error);
        }
    }

    /* Eliminacion de la carpeta de archivos de algún equipo */
    private eliminarFolder = async (dir: string): Promise<any> => {
        try {
            const fsPromise = fs.promises;
            await fsPromise.rm(`./storage/${dir}`, { recursive: true })
        } catch(error) {
            console.error(`error al eliminar los archivos: ${error}`.red);
            return new InternalServerException(codigos.indefinido, error);
        }
    }

    public obtenerCatalogoPDF= async (laboratorio: string, tipo: string):Promise<any> => {
        if(tipo === undefined || tipo === null || tipo === '') 
            return new DataNotFoundException(codigos.informacionNoEnviada);
        if(laboratorio === undefined || laboratorio === null || laboratorio === '') 
            return new DataNotFoundException(codigos.informacionNoEnviada);
        //
        const busqueda: Equipo[] | DataNotFoundException | InternalServerException = await this.obtenerEquipoTipo(tipo,laboratorio);

        if(busqueda instanceof DataNotFoundException || busqueda instanceof InternalServerException)
            return busqueda;
        
        //estructura de tipo para path
        const tipoPath = tipo.toLowerCase().replace(" ", "_");

        //encontramos el nombre del laboratorio para path
        const labres = await LAB.findById(laboratorio, 'nombre').exec() 
        //añadimos formato
        const labpick = labres as Laboratorio;
        //corregimos formato para usarlo en forma de path
        const lab_split = labpick.nombre.split(' ');        
        const lab = lab_split[0].toLowerCase()+lab_split[1];
        const ruta = `./storage/${lab}/${tipoPath}/doc.pdf`;

        //creacion de estructura de busqueda
        let arrBody = busqueda.map( obj =>{
            let imgformatqr = (typeof obj.path == "string") ? obj.path :"imagen no encontrada";
            let imgformat = (typeof obj.path == "string") ? obj.path :"imagen no encontrada";
            /*try {
                imgformatqr = "data:image/png;base64," + await fsPromise.readFile(`./storage/${obj.path}/qr.png`, { encoding: 'base64' });
                imgformat = "data:image/png;base64," + await fsPromise.readFile(`./storage/${obj.path}/imagen.png`, { encoding: 'base64' });
            } catch(error) {}
            */
            let descripcion = obj.caracteristicas.descripcion;
            if (typeof descripcion != "string")
                descripcion = "No cuenta con descripcion"    
            
            const aux: CellInput[] = [imgformatqr, obj.nombre, descripcion, imgformat];
            return aux
        })
         //construccion de pdf
        const doc = new jsPDF();
        this.setPortada(doc, tipo, labpick.nombre)
        // agregado de tabla
        autoTable(doc, {
            columnStyles: {0:{minCellHeight:50, cellWidth:50, overflow:'ellipsize'},3:{minCellHeight:50, cellWidth:50, overflow:'ellipsize'}},
            head: [['QR','Nombre','Descripción','Foto muestra']],
            body: arrBody,
            foot: [['QR','Nombre','Descripción','Foto muestra']],
            didDrawCell: function(data) {
                if ((data.column.index === 0 || data.column.index === 3)&& data.cell.section === 'body') {
                    let image = data.cell.raw;
                    //var img = td.getElementsByTagName('img')[0];
                    if(image !=  "imagen no encontrada"){
                        try{
                            if(data.column.index === 0 )
                                image = "data:image/png;base64," + fs.readFileSync(`./storage/${image}/qr.png`, { encoding: 'base64' });
                            else
                                image = "data:image/png;base64," + fs.readFileSync(`./storage/${image}/imagen.png`, { encoding: 'base64' });
                            const dim = data.cell.height - data.cell.padding('vertical');
                            const textPos = data.cell.getTextPos();
                            doc.addImage(image, textPos.x,  textPos.y, dim, dim);
                        }catch(error) {}
                    }
                }
            }
        })
        //salvar documento
        doc.save(`${ruta}`);

        //intento de retorno de documento
        try {
            await copyFile(`${ruta}`, path.join(__dirname,"../../../..", `/srei/public/lib/web/pdfs/doc_${laboratorio}_${tipoPath}.pdf`), (err) =>{
                if (err)
                    console.log("Error al copiar documento: "+ err)
            });
            return ruta;
        } catch(error) {
            console.log(`Error al buscar el pdf: ${error}`.red);
            return new DataNotFoundException(codigos.datoNoEncontrado)
        }


        
    }
    private setPortada(doc: any,  tipo: string, nombre: string) {
        let ruta = `ipnlogos/`;
        const maxW = doc.internal.pageSize.getWidth();
        const maxH = doc.internal.pageSize.getHeight();
        try {
            const ipnImg = fs.readFileSync(`./storage/${ruta}ipn.jpg`, { encoding: 'base64' });
            const upiizImg = fs.readFileSync(`./storage/${ruta}upiiz.jpg`, { encoding: 'base64' });
            doc.addImage(`data:image/png;base64,${ipnImg}`, 'JPEG', 20, 10, 15.5, 25.3)
            doc.addImage(`data:image/png;base64,${upiizImg}`, 'JPEG', maxW-45.3, 10, 25.3, 25.3)
            
        } catch(error) {
            console.log(`Error al buscar la imagen: ${error}`.red);
        }
        doc.setFont("Times")
        doc.text("Instituto Politecnico Nacional", 105, 20, {align: "center",maxWidth:100})
        doc.text("Unidad Profesional Interdisciplinaria de Ingeniería campus Zacatecas", 105, 27, {align: "center",maxWidth:100})
        doc.setFillColor(90, 0, 0);
        for(let i = 1; i<6; i++){
            const x = 20+((i-1)*i*0.45)
            doc.rect(x,80,i*.5,50, 'F')
        }
        // Filled square
        doc.rect(34, 80, 155, 50, 'F');
        doc.setTextColor("#FFFFFF");
        doc.setFontSize(36)
        doc.setFont("Times")
        doc.text("Catálogos SReI", 40, 95)
        doc.setFontSize(24)
        doc.setFont("Times","Italic")
        doc.text(`Catálogo de ${tipo} del laboratorio: ${nombre}`, 180, 110, {align: "right",maxWidth:120})

        doc.setFillColor(0, 0, 0);
        doc.rect(12, 5, 1.5, maxH-10, 'F');
        doc.roundedRect(maxW-110, maxH-25, 100, 15, 5, 5,'S');
        doc.setTextColor("#000000");
        doc.setFontSize(11)
        doc.setFont("Times", "Normal")
        doc.text(`Catálogos desarrollados por SReI para su apartado de prestamos, coautores: GBautista & OBelmont`,maxW-105, maxH-18, {maxWidth:90})
        doc.addPage();
    }
}

export default CatalogoCM;