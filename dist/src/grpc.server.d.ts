import { Context, Constructor } from '@loopback/context';
import { Server, Application } from '@loopback/core';
import * as grpc from 'grpc';
import { ProtoGenerator } from './proto.generator';
import { GrpcSequenceInterface } from './grpc.sequence';
export declare class GrpcServer extends Context implements Server {
    app: Application;
    private config;
    private generator;
    private _host;
    private _port;
    private _listening;
    _server: grpc.Server;
    constructor(app: Application, config: GrpcServerConfig, generator: ProtoGenerator);
    private _setupControllerMethods;
    private _wrapGrpcSequence;
    readonly listening: boolean;
    start(): Promise<void>;
    stop(): Promise<void>;
}
export declare type GrpcServerConfig = {
    host?: string;
    port?: number;
    sequence?: Constructor<GrpcSequenceInterface>;
    [key: string]: any;
};
