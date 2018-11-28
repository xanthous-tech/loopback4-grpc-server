import * as grpc from 'grpc';
export declare type GrpcServiceMetadata<T> = grpc.ServiceDefinition<T>;
export declare type GrpcServiceMethodMetadata<RequestType, ResponseType> = grpc.MethodDefinition<RequestType, ResponseType>;
export declare function GrpcService<T>(serviceMetadata: GrpcServiceMetadata<T>): ClassDecorator;
export declare function GrpcServiceMethod<RequestType, ResponseType>(serviceMethodMetadata: GrpcServiceMethodMetadata<RequestType, ResponseType>): MethodDecorator;
