import {Component, ProviderMap, Constructor, Server} from '@loopback/core';
import {GrpcBindings} from './grpc.bindings';
import {GeneratorProvider} from './providers/generator.provider';
import {GrpcServer} from './grpc.server';

export class GrpcComponent implements Component {
  providers: ProviderMap = {
    [GrpcBindings.GENERATOR]: GeneratorProvider,
  };

  servers: {[name: string]: Constructor<Server>} = {
    GrpcServer,
  };
}
