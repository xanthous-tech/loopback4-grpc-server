"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grpc_bindings_1 = require("./grpc.bindings");
const generator_provider_1 = require("./providers/generator.provider");
const grpc_server_1 = require("./grpc.server");
class GrpcComponent {
    constructor() {
        this.providers = {
            [grpc_bindings_1.GrpcBindings.GENERATOR]: generator_provider_1.GeneratorProvider,
        };
        this.servers = {
            GrpcServer: grpc_server_1.GrpcServer,
        };
    }
}
exports.GrpcComponent = GrpcComponent;
//# sourceMappingURL=grpc.component.js.map