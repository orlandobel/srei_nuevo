import HttpException from "./HttpException";
 
class DataNotFoundException extends HttpException {
  constructor(codigo: string, mensaje = 'El documento no fue encontrado') {
    super(404, mensaje, codigo);
  }
}
 
export default DataNotFoundException;