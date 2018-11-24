import * as grpc from 'grpc';
export interface GrpcSequenceInterface {
    wrapUnaryCall(call: grpc.ServerUnaryCall<any>): Promise<any>;
    wrapClientStreamingCall(call: grpc.ServerReadableStream<any>): Promise<any>;
    wrapServerStreamingCall(call: grpc.ServerWriteableStream<any>): void;
    wrapBidiStreamingCall(call: grpc.ServerDuplexStream<any, any>): void;
}
export declare class GrpcSequence implements GrpcSequenceInterface {
    protected controller: {
        [method: string]: Function;
    };
    protected method: string;
    constructor(controller: {
        [method: string]: Function;
    }, method: string);
    wrapUnaryCall(call: grpc.ServerUnaryCall<any>): Promise<any>;
    wrapClientStreamingCall(call: grpc.ServerReadableStream<any>): Promise<any>;
    wrapServerStreamingCall(call: grpc.ServerWriteableStream<any>): void;
    wrapBidiStreamingCall(call: grpc.ServerDuplexStream<any, any>): void;
}
