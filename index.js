// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/example-rpc-server
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

module.exports = require('./dist');

if (require.main === module) {
  // Run the application
  const { TestApplication } = require('./dist/test/acceptance/application');

  const main = async (options = {}) => {
    const app = new TestApplication(options);
    await app.boot();
    await app.start();
    console.log(`Server is running on port ${app.options.port}`);
    return app;
  };

  main().catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
