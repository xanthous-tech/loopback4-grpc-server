import * as grpc from 'grpc';
import {ClassDecoratorFactory, MethodDecoratorFactory} from '@loopback/core';
import {GrpcBindings} from '../grpc.bindings';

export interface GrpcServiceMetadata {
  serviceDefiniton: grpc.ServiceDefinition<grpc.UntypedServiceImplementation>;
}

export interface GrpcServiceMethodMetadata {
  // tslint:disable-next-line:no-any
  methodDefinition: grpc.MethodDefinition<any, any>;
}

export function grpcService(
  serviceMetadata: GrpcServiceMetadata,
): ClassDecorator {
  return ClassDecoratorFactory.createDecorator<GrpcServiceMetadata>(
    GrpcBindings.SERVICE_DEFINITION,
    serviceMetadata,
  );
}

export function grpcServiceMethod(
  serviceMethodMetadata: GrpcServiceMethodMetadata,
): MethodDecorator {
  return MethodDecoratorFactory.createDecorator<GrpcServiceMethodMetadata>(
    GrpcBindings.SERVICE_METHOD_DEFINITION,
    serviceMethodMetadata,
  );
}
