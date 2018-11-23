// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-rpc-server
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Application, ApplicationConfig} from '@loopback/core';
import {GrpcBindings} from './grpc.bindings';
import {GrpcComponent} from './grpc.component';
import {BookController} from './controllers/book.controller';

export class MyApplication extends Application {
  options: ApplicationConfig;
  constructor(options: ApplicationConfig = {}) {
    // Allow options to replace the defined components array, if desired.
    super(options);
    this.component(GrpcComponent);
    this.controller(BookController);
    this.options.port = this.options.port || 3000;
    this.bind(GrpcBindings.SERVER_CONFIG).to({
      host: '0.0.0.0',
      port: 3001,
      'grpc.max_send_message_length': 1024 * 1024 * 1024,
    });
    this.bind(GrpcBindings.GENERATOR_CONFIG).to({});
  }
}