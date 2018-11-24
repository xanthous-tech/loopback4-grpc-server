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
const core_1 = require("@loopback/core");
const grpc_bindings_1 = require("./grpc.bindings");
const generator_provider_1 = require("./providers/generator.provider");
const grpc_server_1 = require("./grpc.server");
const grpc_sequence_1 = require("./grpc.sequence");
let GrpcComponent = class GrpcComponent {
    constructor(app, config) {
        this.providers = {
            [grpc_bindings_1.GrpcBindings.GENERATOR]: generator_provider_1.GeneratorProvider,
        };
        this.servers = {
            GrpcServer: grpc_server_1.GrpcServer,
        };
        if (config.sequence) {
            app.bind(grpc_bindings_1.GrpcBindings.SERVER_SEQUENCE).toClass(config.sequence);
        }
        else {
            app.bind(grpc_bindings_1.GrpcBindings.SERVER_SEQUENCE).toClass(grpc_sequence_1.GrpcSequence);
        }
    }
};
GrpcComponent = __decorate([
    __param(0, core_1.inject(core_1.CoreBindings.APPLICATION_INSTANCE)),
    __param(1, core_1.inject(grpc_bindings_1.GrpcBindings.SERVER_CONFIG)),
    __metadata("design:paramtypes", [core_1.Application, Object])
], GrpcComponent);
exports.GrpcComponent = GrpcComponent;
//# sourceMappingURL=grpc.component.js.map