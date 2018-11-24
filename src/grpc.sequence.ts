// tslint:disable:no-any
import * as grpc from 'grpc';
import {inject} from '@loopback/core';
import {GrpcBindings} from './grpc.bindings';

export interface GrpcSequenceInterface {
  wrapUnaryCall(call: grpc.ServerUnaryCall<any>): Promise<any>;
  wrapClientStreamingCall(call: grpc.ServerReadableStream<any>): Promise<any>;
  wrapServerStreamingCall(call: grpc.ServerWriteableStream<any>): void;
  wrapBidiStreamingCall(call: grpc.ServerDuplexStream<any, any>): void;
}

export class GrpcSequence implements GrpcSequenceInterface {
  constructor(
    @inject(GrpcBindings.TEMP_CONTROLLER)
    protected controller: {[method: string]: Function},
    @inject(GrpcBindings.TEMP_METHOD_NAME) protected method: string,
  ) {}
  async wrapUnaryCall(call: grpc.ServerUnaryCall<any>): Promise<any> {
    // Do something before call
    const reply = await this.controller[this.method](call.request);
    // Do something after call
    return reply;
  }
  async wrapClientStreamingCall(
    call: grpc.ServerReadableStream<any>,
  ): Promise<any> {
    // Do something before call
    const reply = await this.controller[this.method](call);
    // Do something after call
    return reply;
  }
  wrapServerStreamingCall(call: grpc.ServerWriteableStream<any>): void {
    // Do something before call
    this.controller[this.method](call);
    // Do something after call
  }
  wrapBidiStreamingCall(call: grpc.ServerDuplexStream<any, any>): void {
    // Do something before call
    this.controller[this.method](call);
    // Do something after call
  }
}
// tslint:enable:no-any
