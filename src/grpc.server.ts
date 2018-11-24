import {
  inject,
  Context,
  MetadataInspector,
  Constructor,
  BindingScope,
  MetadataMap,
  BindingKey,
} from '@loopback/context';
import {
  Server,
  Application,
  CoreBindings,
  ControllerClass,
} from '@loopback/core';
import {GrpcBindings} from './grpc.bindings';
import * as grpc from 'grpc';
import {ProtoGenerator} from './proto.generator';
import {
  GrpcServiceMetadata,
  GrpcServiceMethodMetadata,
} from './decorators/grpc.decorator';
import {GrpcSequenceInterface, GrpcSequence} from './grpc.sequence';

export class GrpcServer extends Context implements Server {
  private _host: string;
  private _port: number;
  private _listening: boolean = false;
  private _server: grpc.Server;

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) public app: Application,
    @inject(GrpcBindings.SERVER_CONFIG) private config: GrpcServerConfig,
    @inject(GrpcBindings.GENERATOR) private generator: ProtoGenerator,
  ) {
    super(app);
    // work out grpc server options
    this._host = this.config.host || '127.0.0.1';
    this._port = this.config.port || 3000;
    delete this.config.host;
    delete this.config.port;
    // don't need the sequence here
    delete this.config.sequence;

    // create new grpc server with config
    this._server = new grpc.Server(this.config);

    // binding server to host:port
    this._server.bind(
      `${this._host}:${this._port}`,
      grpc.ServerCredentials.createInsecure(),
    );
  }

  private _setUpServer() {
    // Setup Controllers
    for (const b of this.find('controllers.*')) {
      const controllerName = b.key.replace(/^controllers\./, '');
      const ctor = b.valueConstructor;
      if (!ctor) {
        throw new Error(
          `The controller ${controllerName} was not bound via .toClass()`,
        );
      }
      this._setupControllerMethods(ctor);
    }
  }

  private _setupControllerMethods(ctor: ControllerClass) {
    const controllerMetadata = MetadataInspector.getClassMetadata<
      GrpcServiceMetadata
    >(GrpcBindings.SERVICE_DEFINITION, ctor);

    const controllerMethodsMetadata = MetadataInspector.getAllMethodMetadata<
      GrpcServiceMethodMetadata
    >(GrpcBindings.SERVICE_METHOD_DEFINITION, ctor.prototype);

    if (controllerMetadata) {
      this._server.addService(
        controllerMetadata.serviceDefiniton,
        this._wrapGrpcSequence(ctor, controllerMethodsMetadata),
      );
    }
  }

  private _wrapGrpcSequence(
    ctor: ControllerClass,
    methodsMetadata?: MetadataMap<GrpcServiceMethodMetadata>,
  ): grpc.UntypedServiceImplementation {
    const context: Context = this;

    context.bind(GrpcBindings.SERVER_CONTEXT).to(context);
    context
      .bind(GrpcBindings.TEMP_CONTROLLER)
      .toClass(ctor)
      .inScope(BindingScope.CONTEXT);

    if (!methodsMetadata) {
      return {};
    }

    return Object.keys(methodsMetadata).reduce(
      (
        wrappedMethods: grpc.UntypedServiceImplementation,
        methodName: string,
      ) => {
        context.bind(GrpcBindings.TEMP_METHOD_NAME).to(methodName);
        const bindingKey: BindingKey<GrpcSequence> = BindingKey.create<
          GrpcSequence
        >(GrpcBindings.SERVER_SEQUENCE);
        const sequencePromise: Promise<GrpcSequence> = context.get(bindingKey);

        const methodMetadata = methodsMetadata[methodName];
        const {methodDefinition} = methodMetadata;
        const {requestStream, responseStream} = methodDefinition;

        if (requestStream) {
          if (responseStream) {
            // bidi stream
            wrappedMethods[methodName] = function(
              // tslint:disable-next-line:no-any
              call: grpc.ServerDuplexStream<any, any>,
            ) {
              sequencePromise.then((sequence: GrpcSequence) =>
                sequence.wrapBidiStreamingCall(call),
              );
            };
          } else {
            // client stream
            wrappedMethods[methodName] = function(
              // tslint:disable-next-line:no-any
              call: grpc.ServerReadableStream<any>,
              // tslint:disable-next-line:no-any
              callback: grpc.sendUnaryData<any>,
            ) {
              sequencePromise
                .then((sequence: GrpcSequence) =>
                  sequence.wrapClientStreamingCall(call),
                )
                .then(result => callback(null, result))
                .catch(error => callback(error, null));
            };
          }
        } else {
          if (responseStream) {
            // server streaming
            wrappedMethods[methodName] = function(
              // tslint:disable-next-line:no-any
              call: grpc.ServerWriteableStream<any>,
            ) {
              sequencePromise.then((sequence: GrpcSequence) =>
                sequence.wrapServerStreamingCall(call),
              );
            };
          } else {
            // unary call
            wrappedMethods[methodName] = function(
              // tslint:disable-next-line:no-any
              call: grpc.ServerUnaryCall<any>,
              // tslint:disable-next-line:no-any
              callback: grpc.sendUnaryData<any>,
            ) {
              sequencePromise
                .then((sequence: GrpcSequence) => sequence.wrapUnaryCall(call))
                .then(result => callback(null, result))
                .catch(error => callback(error, null));
            };
          }
        }

        return wrappedMethods;
      },
      {},
    );
  }

  get listening() {
    return this._listening;
  }

  async start(): Promise<void> {
    await this.generator.execute();
    this._setUpServer();
    this._listening = true;
    console.log(`gRPC server listening at ${this._host}:${this._port}`);
    this._server.start();
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
  sequence?: Constructor<GrpcSequenceInterface>;
  // tslint:disable-next-line:no-any
  [key: string]: any;
};
