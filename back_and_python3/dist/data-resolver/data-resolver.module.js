"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataResolverModule = void 0;
const common_1 = require("@nestjs/common");
const data_resolver_controller_1 = require("./data-resolver.controller");
const data_resolver_service_1 = require("./data-resolver.service");
const http_config_module_1 = require("../http-config/http-config.module");
let DataResolverModule = class DataResolverModule {
};
DataResolverModule = __decorate([
    common_1.Module({
        imports: [http_config_module_1.HttpConfigModule],
        controllers: [data_resolver_controller_1.DataResolverController],
        providers: [data_resolver_service_1.DataResolverService]
    })
], DataResolverModule);
exports.DataResolverModule = DataResolverModule;
//# sourceMappingURL=data-resolver.module.js.map