"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("@loopback/context");
const core_1 = require("@loopback/core");
const grpc_bindings_1 = require("./grpc.bindings");
const grpc = require("grpc");
const proto_generator_1 = require("./proto.generator");
let GrpcServer = class GrpcServer extends context_1.Context {
    constructor(app, config, generator) {
        super(app);
        this.app = app;
        this.config = config;
        this.generator = generator;
        this._listening = false;
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
                throw new Error(`The controller ${controllerName} was not bound via .toClass()`);
            }
            this._setupControllerMethods(ctor, b.getValue(app));
        }
        // binding server to host:port
        this._server.bind(`${this._host}:${this._port}`, grpc.ServerCredentials.createInsecure());
    }
    _setupControllerMethods(ctor, instance) {
        const metadata = context_1.MetadataInspector.getClassMetadata(grpc_bindings_1.GrpcBindings.SERVICE_DEFINITION, ctor);
        if (metadata) {
            this._server.addService(metadata.serviceDefiniton, instance);
        }
    }
    get listening() {
        return this._listening;
    }
    async start() {
        this._server.start();
        this._listening = true;
        console.log(`gRPC server listening at ${this._host}:${this._port}`);
    }
    async stop() {
        // stops receiving calls first, and try to shutdown
        this._listening = false;
        return new Promise(resolve => {
            this._server.tryShutdown(() => {
                resolve();
            });
        });
    }
};
GrpcServer = __decorate([
    __param(0, context_1.inject(core_1.CoreBindings.APPLICATION_INSTANCE)),
    __param(1, context_1.inject(grpc_bindings_1.GrpcBindings.SERVER_CONFIG)),
    __param(2, context_1.inject(grpc_bindings_1.GrpcBindings.GENERATOR)),
    __metadata("design:paramtypes", [core_1.Application, Object, proto_generator_1.ProtoGenerator])
], GrpcServer);
exports.GrpcServer = GrpcServer;
//# sourceMappingURL=grpc.server.js.map