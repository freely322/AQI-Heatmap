"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataResolverController = void 0;
const common_1 = require("@nestjs/common");
const data_resolver_service_1 = require("./data-resolver.service");
let DataResolverController = class DataResolverController {
    constructor(dataResolverService) {
        this.dataResolverService = dataResolverService;
    }
    async getCoordinates(type) {
        return await this.dataResolverService.getCoordinates(type);
    }
};
__decorate([
    common_1.Get('coordinates'),
    __param(0, common_1.Query('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DataResolverController.prototype, "getCoordinates", null);
DataResolverController = __decorate([
    common_1.Controller('data-resolver'),
    __metadata("design:paramtypes", [data_resolver_service_1.DataResolverService])
], DataResolverController);
exports.DataResolverController = DataResolverController;
//# sourceMappingURL=data-resolver.controller.js.map