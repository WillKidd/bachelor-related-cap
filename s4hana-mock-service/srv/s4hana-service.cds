using mock.test.s4hana as db from '../db/schema';

service MockService {
  entity Products as projection on db.Products;
  entity Inventory as projection on db.Inventory;
  entity Orders as projection on db.Orders;
  entity OrderItems as projection on db.OrderItems;
  entity FinancialData as projection on db.FinancialData;
  entity Customers as projection on db.Customers;
}