using mock.test.s4hana as db from '../db/schema';

service MockService {
  entity Products as projection on db.Products;
  entity Inventory as projection on db.Inventory;
  entity Orders as projection on db.Orders;
  entity OrderItems as projection on db.OrderItems;
  entity FinancialData as projection on db.FinancialData;
  entity Customers as projection on db.Customers;
  // Customer related actions and function
  // FinancialData related actions and function
  // Inventory related actions and function
  // OrderItems related actions and function
  // Order related actions and function
  action submitOrder (customerID: UUID, items: array of OrderItems);
  action cancelOrder(orderID: UUID);
  // Product related actions and function
}