"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpConfigModule = void 0;
const common_1 = require("@nestjs/common");
const dotenv_1 = require("dotenv");
const environment = process.env.NODE_ENV || 'development';
dotenv_1.config({
    path: `.env.${environment}`
});
let HttpConfigModule = class HttpConfigModule {
};
HttpConfigModule = __decorate([
    common_1.Module({
        imports: [
            common_1.HttpModule.register({
                baseURL: process.env.HOST,
                timeout: 5000,
                maxRedirects: 5,
            }),
        ],
        exports: [common_1.HttpModule]
    })
], HttpConfigModule);
exports.HttpConfigModule = HttpConfigModule;
//# sourceMappingURL=http-config.module.js.map