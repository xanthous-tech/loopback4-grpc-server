import * as grpc from 'grpc';
import { Config } from './types';
export declare class ProtoGenerator {
    protected config?: Config.Generator | undefined;
    constructor(config?: Config.Generator | undefined);
    execute(): Promise<void>;
    loadProto(protoPath: string): Promise<grpc.GrpcObject>;
    getProtoPaths(): Promise<string[]>;
    private generateTS;
    private generateJS;
}
