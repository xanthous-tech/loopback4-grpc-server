import * as grpc from 'grpc';
export interface GrpcServiceMetadata {
    serviceDefiniton: grpc.ServiceDefinition<grpc.UntypedServiceImplementation>;
}
export interface GrpcServiceMethodMetadata {
    methodDefinition: grpc.MethodDefinition<any, any>;
}
export declare function grpcService(serviceMetadata: GrpcServiceMetadata): ClassDecorator;
export declare function grpcServiceMethod(serviceMethodMetadata: GrpcServiceMethodMetadata): MethodDecorator;
