"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codigos_1 = require("./codigos");
/**
 * https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 */
class HttpException extends Error {
    constructor(status, mensaje, codigo = codigos_1.codigos.indefinido, extra) {
        super(mensaje);
        this.status = status;
        this.mensaje = mensaje;
        this.codigo = codigo;
        if (extra !== undefined && extra !== null) {
            this.extra = {
                name: extra.name,
                message: extra.message
            };
        }
    }
}
exports.default = HttpException;
//# sourceMappingURL=HttpException.js.map