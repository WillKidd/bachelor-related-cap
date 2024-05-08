using { mock.test.s4hana as s4hana } from '../db/schema';

service ProductService {
  entity Products as projection on s4hana.Products;
}

service InventoryService {
  entity Inventory as projection on s4hana.Inventory;
}

service OrderService {
  entity Orders as projection on s4hana.Orders;
}

service FinancialDataService {
  entity FinancialData as projection on s4hana.FinancialData;
}

service CustomerService {
  entity Customers as projection on s4hana.Customers;
}
