using {mock.test.s4hana as db} from '../db/schema';

service MockService {
  entity Products as projection on db.Products;
  entity Inventory as projection on db.Inventory;
  entity Orders as projection on db.Orders;
  entity OrderItems as projection on db.OrderItems;
  entity Customers as projection on db.Customers;
  // Customer related actions and function
  action updateCustomerData(customerID: UUID, data: Customers);
  // FinancialData related actions and function
  // Inventory related actions and function
  // OrderItems related actions and function
  // Order related actions and function
  action submitOrder (customerID: UUID, items: array of OrderItems);
  action cancelOrder(orderID: UUID);
  action fulfilOrder(orderID: UUID);
  // Product related actions and function
}
/*
2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR node:internal/modules/cjs/loader:1134
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR const err = new Error(message);
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR ^
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR Error: Cannot find module '@sap/xssec'. Make sure to install it with 'npm i @sap/xssec'
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR Cannot find module '@sap/xssec'
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR Require stack:
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR - /home/vcap/app/node_modules/@sap/cds/libx/_runtime/common/utils/require.js
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR - /home/vcap/app/node_modules/@sap/cds/lib/auth/jwt-auth.js
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR - /home/vcap/app/node_modules/@sap/cds/lib/auth/index.js
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR - /home/vcap/app/node_modules/@sap/cds/lib/srv/middlewares/index.js
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR - /home/vcap/app/node_modules/@sap/cds/lib/index.js
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR - /home/vcap/app/node_modules/@sap/cds/bin/cds-serve.js
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR at Module._resolveFilename (node:internal/modules/cjs/loader:1134:15)
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR at Module._load (node:internal/modules/cjs/loader:975:27)
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR at Module.require (node:internal/modules/cjs/loader:1225:19)
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR at require (node:internal/modules/helpers:177:18)
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR at module.exports (/home/vcap/app/node_modules/@sap/cds/libx/_runtime/common/utils/require.js:4:12)
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR at Object.<anonymous> (/home/vcap/app/node_modules/@sap/cds/lib/auth/jwt-auth.js:6:15)
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR at Module._compile (node:internal/modules/cjs/loader:1356:14)
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR at Module._extensions..js (node:internal/modules/cjs/loader:1414:10)
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR at Module.load (node:internal/modules/cjs/loader:1197:32)
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR at Module._load (node:internal/modules/cjs/loader:1013:12) {
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR code: 'MODULE_NOT_FOUND',
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR requireStack: [
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR '/home/vcap/app/node_modules/@sap/cds/libx/_runtime/common/utils/require.js',
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR '/home/vcap/app/node_modules/@sap/cds/lib/auth/jwt-auth.js',
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR '/home/vcap/app/node_modules/@sap/cds/lib/auth/index.js',
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR '/home/vcap/app/node_modules/@sap/cds/lib/srv/middlewares/index.js',
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR '/home/vcap/app/node_modules/@sap/cds/lib/index.js',
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR '/home/vcap/app/node_modules/@sap/cds/bin/cds-serve.js'
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR ]
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR }
   2024-05-28T21:36:49.93+0200 [APP/PROC/WEB/0] ERR Node.js v18.19.1
   2024-05-28T21:36:49.94+0200 [APP/PROC/WEB/0] ERR npm notice
   2024-05-28T21:36:49.94+0200 [APP/PROC/WEB/0] ERR npm notice New minor version of npm available! 10.2.4 -> 10.8.0
   2024-05-28T21:36:49.94+0200 [APP/PROC/WEB/0] ERR npm notice Changelog: <https://github.com/npm/cli/releases/tag/v10.8.0>
   2024-05-28T21:36:49.94+0200 [APP/PROC/WEB/0] ERR npm notice Run `npm install -g npm@10.8.0` to update!
   2024-05-28T21:36:49.94+0200 [APP/PROC/WEB/0] ERR npm notice
   */