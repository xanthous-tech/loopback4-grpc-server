"use strict";
// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-rpc-server
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@loopback/core");
const grpc_bindings_1 = require("./grpc.bindings");
const grpc_component_1 = require("./grpc.component");
const book_controller_1 = require("./controllers/book.controller");
class MyApplication extends core_1.Application {
    constructor(options = {}) {
        // Allow options to replace the defined components array, if desired.
        super(options);
        this.component(grpc_component_1.GrpcComponent);
        this.controller(book_controller_1.BookController);
        this.options.port = this.options.port || 3000;
        this.bind(grpc_bindings_1.GrpcBindings.SERVER_CONFIG).to({
            host: '0.0.0.0',
            port: 3001,
            'grpc.max_send_message_length': 1024 * 1024 * 1024,
        });
        this.bind(grpc_bindings_1.GrpcBindings.GENERATOR_CONFIG).to({});
    }
}
exports.MyApplication = MyApplication;
//# sourceMappingURL=application.js.map