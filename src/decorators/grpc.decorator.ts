import * as grpc from 'grpc';
import { ClassDecoratorFactory, MethodDecoratorFactory } from '@loopback/core';
import { GrpcBindings } from '../grpc.bindings';

export type GrpcServiceMetadata<T> =
  grpc.ServiceDefinition<T>;

export type GrpcServiceMethodMetadata<RequestType, ResponseType> =
  grpc.MethodDefinition<RequestType, ResponseType>;

export function GrpcService<T>(
  serviceMetadata: GrpcServiceMetadata<T>,
): ClassDecorator {
  return ClassDecoratorFactory.createDecorator<GrpcServiceMetadata<T>>(
    GrpcBindings.SERVICE_DEFINITION,
    serviceMetadata,
  );
}

export function GrpcServiceMethod<RequestType, ResponseType>(
  serviceMethodMetadata: GrpcServiceMethodMetadata<RequestType, ResponseType>,
): MethodDecorator {
  return MethodDecoratorFactory.createDecorator<GrpcServiceMethodMetadata<RequestType, ResponseType>>(
    GrpcBindings.SERVICE_METHOD_DEFINITION,
    serviceMethodMetadata,
  );
}
