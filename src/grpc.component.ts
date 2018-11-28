import {
  Component,
  ProviderMap,
  Constructor,
  Server,
  CoreBindings,
  Application,
  inject,
} from '@loopback/core';
import { GrpcBindings } from './grpc.bindings';
import { GrpcServer, GrpcServerConfig } from './grpc.server';
import { GrpcSequence } from './grpc.sequence';

export class GrpcComponent implements Component {
  servers: { [name: string]: Constructor<Server> } = {
    GrpcServer,
  };

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) app: Application,
    @inject(GrpcBindings.SERVER_CONFIG) config: GrpcServerConfig,
  ) {
    if (config.sequence) {
      app.bind(GrpcBindings.SERVER_SEQUENCE).toClass(config.sequence);
    } else {
      app.bind(GrpcBindings.SERVER_SEQUENCE).toClass(GrpcSequence);
    }
  }
}
