import * as grpc from 'grpc';
export interface GrpcServiceMetadata {
    serviceDefiniton: grpc.ServiceDefinition<grpc.UntypedServiceImplementation>;
}
export declare function grpcService(serviceMetadata: GrpcServiceMetadata): ClassDecorator;
