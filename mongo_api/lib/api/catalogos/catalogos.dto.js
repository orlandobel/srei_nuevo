"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditarEquipo = exports.CrearEquipo = void 0;
const class_validator_1 = require("class-validator");
const ValidateNested_1 = require("./ValidateNested");
class Caracteristicas {
}
__decorate([
    (0, class_validator_1.IsDefined)({
        message: "El fabricante no puede estar vacio"
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: "El fabricante no puede estar vacio"
    })
], Caracteristicas.prototype, "fabricante", void 0);
__decorate([
    (0, class_validator_1.IsDefined)({
        message: "El modelo no puede estar vacio"
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: "El modelo no puede estar vacio"
    })
], Caracteristicas.prototype, "modelo", void 0);
__decorate([
    (0, class_validator_1.IsDefined)({
        message: "El numero de serie no puede estar vacio"
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: "El numero de serie no puede estar vacio"
    })
], Caracteristicas.prototype, "serie", void 0);
class Equipo {
}
__decorate([
    (0, class_validator_1.IsDefined)({
        message: "El nombre del Equipo no puede estar vacio."
    }),
    (0, class_validator_1.IsString)({
        message: "El nombre del Equipo debe de ser de tipo string."
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: "El nombre del Equipo no puede estar vacio."
    })
], Equipo.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsDefined)({
        message: "El tipo del Equipo no puede ser nulo."
    }),
    (0, class_validator_1.IsString)({
        message: "El tipo del Equipo debe de ser de tipo string."
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: "El tipo del Equipo no puede ser una cadena vacía."
    })
], Equipo.prototype, "tipo", void 0);
__decorate([
    (0, class_validator_1.IsDefined)({
        message: "El estado del Equipo no puede ser nulo."
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({
        message: "El estado del Equipo no puede estar vacio."
    })
], Equipo.prototype, "estado", void 0);
__decorate([
    (0, class_validator_1.IsDefined)({
        message: "El campo disponible del Equipo no puede ser nulo."
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)({
        message: "El campo disponible del Equipo no puede estar vacio."
    })
], Equipo.prototype, "disponible", void 0);
__decorate([
    (0, class_validator_1.IsDefined)({
        message: "El propietario del Equipo no puede ser nulo."
    }),
    (0, class_validator_1.IsString)({
        message: "El propietario del Equipo debe de ser de tipo string."
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: "El propietario del Equipo no puede ser una cadena vacía."
    })
], Equipo.prototype, "propietario", void 0);
__decorate([
    (0, ValidateNested_1.ValidateNested)(Caracteristicas)
], Equipo.prototype, "caracteristicas", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDefined)({
        message: "El checklist del Equipo no puede ser nulo."
    }),
    (0, class_validator_1.IsArray)({
        message: "El checklist del Equipo debe de ser del tipo array."
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: "El checklist del Equipo no puede estar vacio."
    })
], Equipo.prototype, "checklist", void 0);
class CrearEquipo {
}
__decorate([
    (0, ValidateNested_1.ValidateNested)(Equipo)
], CrearEquipo.prototype, "eqp", void 0);
exports.CrearEquipo = CrearEquipo;
class Editar {
}
__decorate([
    (0, class_validator_1.IsDefined)({
        message: "El id del Equipo no puede ser nulo."
    }),
    (0, class_validator_1.IsString)({
        message: "El id del Equipo debe de ser de tipo string."
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: "El id del Equipo no puede ser una cadena vacía."
    })
], Editar.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDefined)({
        message: "El nombre del Equipo no puede ser nulo."
    }),
    (0, class_validator_1.IsString)({
        message: "El nombre del Equipo debe de ser de tipo string."
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: "El nombre del Equipo no puede ser una cadena vacía."
    })
], Editar.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDefined)({
        message: "El tipo del Equipo no puede ser nulo."
    }),
    (0, class_validator_1.IsString)({
        message: "El tipo del Equipo debe de ser de tipo string."
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: "El tipo del Equipo no puede ser una cadena vacía."
    })
], Editar.prototype, "tipo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDefined)({
        message: "El estado del Equipo no puede ser nulo."
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({
        message: "El estado del Equipo no puede estar vacio."
    })
], Editar.prototype, "estado", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDefined)({
        message: "El campo disponible del Equipo no puede ser nulo."
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)({
        message: "El campo disponible del Equipo no puede estar vacio."
    })
], Editar.prototype, "disponible", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDefined)({
        message: "El propietario del Equipo no puede ser nulo."
    }),
    (0, class_validator_1.IsString)({
        message: "El propietario del Equipo debe de ser de tipo string."
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: "El propietario del Equipo no puede ser una cadena vacía."
    })
], Editar.prototype, "propietario", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDefined)({
        message: "Las caracteristicas del Equipo no puede ser nulo."
    }),
    (0, class_validator_1.IsObject)({
        message: "Las caracteristicas del Equipo debe de ser un arreglo asociativo."
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: "Las caracteristicas del Equipo no puede estar vacio."
    })
], Editar.prototype, "caracteristicas", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDefined)({
        message: "El checklist del Equipo no puede ser nulo."
    }),
    (0, class_validator_1.IsArray)({
        message: "El checklist del Equipo debe de ser del tipo array."
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: "El checklist del Equipo no puede estar vacio."
    })
], Editar.prototype, "checklist", void 0);
class EditarEquipo {
}
__decorate([
    (0, class_validator_1.IsDefined)({
        message: "El Equipo no puede ser nulo"
    }),
    (0, ValidateNested_1.ValidateNested)(Editar)
], EditarEquipo.prototype, "eqp", void 0);
exports.EditarEquipo = EditarEquipo;
//# sourceMappingURL=catalogos.dto.js.map