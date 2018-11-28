"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@loopback/core");
const grpc_bindings_1 = require("../grpc.bindings");
function GrpcService(serviceMetadata) {
    return core_1.ClassDecoratorFactory.createDecorator(grpc_bindings_1.GrpcBindings.SERVICE_DEFINITION, serviceMetadata);
}
exports.GrpcService = GrpcService;
function GrpcServiceMethod(serviceMethodMetadata) {
    return core_1.MethodDecoratorFactory.createDecorator(grpc_bindings_1.GrpcBindings.SERVICE_METHOD_DEFINITION, serviceMethodMetadata);
}
exports.GrpcServiceMethod = GrpcServiceMethod;
//# sourceMappingURL=grpc.decorator.js.map