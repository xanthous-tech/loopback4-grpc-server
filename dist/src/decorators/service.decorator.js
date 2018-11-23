"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@loopback/core");
const grpc_bindings_1 = require("../grpc.bindings");
function grpcService(serviceMetadata) {
    return core_1.ClassDecoratorFactory.createDecorator(grpc_bindings_1.GrpcBindings.SERVICE_DEFINITION, serviceMetadata);
}
exports.grpcService = grpcService;
//# sourceMappingURL=service.decorator.js.map