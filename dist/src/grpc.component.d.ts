import { Component, ProviderMap, Constructor, Server } from '@loopback/core';
export declare class GrpcComponent implements Component {
    providers: ProviderMap;
    servers: {
        [name: string]: Constructor<Server>;
    };
}
