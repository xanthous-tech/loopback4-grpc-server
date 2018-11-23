import {inject, Context, MetadataInspector} from '@loopback/context';
import {
  Server,
  Application,
  CoreBindings,
  ControllerClass,
} from '@loopback/core';
import {GrpcBindings} from './grpc.bindings';
import * as grpc from 'grpc';
import {ProtoGenerator} from './proto.generator';
import {GrpcServiceMetadata} from './decorators/service.decorator';

export class GrpcServer extends Context implements Server {
  private _host: string;
  private _port: number;
  private _listening: boolean = false;
  _server: grpc.Server;

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) public app: Application,
    @inject(GrpcBindings.SERVER_CONFIG) public config: GrpcServerConfig,
    @inject(GrpcBindings.GENERATOR) private generator: ProtoGenerator,
  ) {
    super(app);
    // generate protos first
    this.generator.execute();

    // work out grpc server options
    this._host = this.config.host || '127.0.0.1';
    this._port = this.config.port || 3000;
    delete this.config.host;
    delete this.config.port;

    // create new grpc server with config
    this._server = new grpc.Server(this.config);

    // Setup Controllers
    for (const b of this.find('controllers.*')) {
      const controllerName = b.key.replace(/^controllers\./, '');
      const ctor = b.valueConstructor;
      if (!ctor) {
        throw new Error(
          `The controller ${controllerName} was not bound via .toClass()`,
        );
      }
      this._setupControllerMethods(ctor, b.getValue(app));
    }

    // binding server to host:port
    this._server.bind(
      `${this._host}:${this._port}`,
      grpc.ServerCredentials.createInsecure(),
    );
  }

  private _setupControllerMethods(
    ctor: ControllerClass,
    instance: grpc.UntypedServiceImplementation,
  ) {
    const metadata = MetadataInspector.getClassMetadata<GrpcServiceMetadata>(
      GrpcBindings.SERVICE_DEFINITION,
      ctor,
    );

    if (metadata) {
      this._server.addService(metadata.serviceDefiniton, instance);
    }
  }

  get listening() {
    return this._listening;
  }

  async start(): Promise<void> {
    this._server.start();
    this._listening = true;
    console.log(`gRPC server listening at ${this._host}:${this._port}`);
  }

  async stop(): Promise<void> {
    // stops receiving calls first, and try to shutdown
    this._listening = false;
    return new Promise<void>(resolve => {
      this._server.tryShutdown(() => {
        resolve();
      });
    });
  }
}

// grpc options defined in
// https://github.com/grpc/grpc/blob/master/include/grpc/impl/codegen/grpc_types.h#L138
// FIXME: should we make it strict? keeping a flexible config type for now in case
//        there are more options added in the future
export type GrpcServerConfig = {
  host?: string;
  port?: number;
  // tslint:disable-next-line:no-any
  [key: string]: any;
};
