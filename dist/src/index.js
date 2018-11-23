"use strict";
// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-rpc-server
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = require("./application");
async function main(options = {}) {
    const app = new application_1.MyApplication(options);
    await app.start();
    console.log(`Server is running on port ${app.options.port}`);
    return app;
}
exports.main = main;
main().catch(err => {
    console.error('Unhandled exception!');
});
//# sourceMappingURL=index.js.map