// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-rpc-server
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { BootMixin } from '@loopback/boot';
import { Application, ApplicationConfig } from '@loopback/core';
import { GrpcBindings } from '../../src/grpc.bindings';
import { GrpcComponent } from '../../src/grpc.component';

export class TestApplication extends BootMixin(Application) {
  options: ApplicationConfig;
  constructor(options: ApplicationConfig = {}) {
    // Allow options to replace the defined components array, if desired.
    super(options);
    this.bind(GrpcBindings.SERVER_CONFIG).to({
      host: '0.0.0.0',
      port: 50051,
      'grpc.max_send_message_length': 1024 * 1024 * 1024,
    });
    this.bind(GrpcBindings.GENERATOR_CONFIG).to({});
    this.component(GrpcComponent);
    this.options.port = this.options.port || 3000;

    this.projectRoot = __dirname;
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
