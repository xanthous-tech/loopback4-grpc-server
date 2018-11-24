import { Component, ProviderMap, Constructor, Server, Application } from '@loopback/core';
import { GrpcServerConfig } from './grpc.server';
export declare class GrpcComponent implements Component {
    providers: ProviderMap;
    servers: {
        [name: string]: Constructor<Server>;
    };
    constructor(app: Application, config: GrpcServerConfig);
}
