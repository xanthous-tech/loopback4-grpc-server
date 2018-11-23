import * as grpc from 'grpc';
import {ClassDecoratorFactory} from '@loopback/core';
import {GrpcBindings} from '../grpc.bindings';

export interface GrpcServiceMetadata {
  serviceDefiniton: grpc.ServiceDefinition<grpc.UntypedServiceImplementation>;
}

export function grpcService(
  serviceMetadata: GrpcServiceMetadata,
): ClassDecorator {
  return ClassDecoratorFactory.createDecorator<GrpcServiceMetadata>(
    GrpcBindings.SERVICE_DEFINITION,
    serviceMetadata,
  );
}
