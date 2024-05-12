namespace mock.test.s4hana;
using {cuid} from '@sap/cds/common';

entity Products: cuid {
  name               : String;
  description        : String;
  price              : Decimal;
  category           : String;
}

entity Inventory: cuid {
  product      : Association to Products;
  location           : String;
  quantity           : Integer;
}

entity Orders: cuid {
  customer       : Association to Customers;
  orderDate          : Date;
  totalAmount        : Decimal;
  status             : String;
  items              : Composition of many OrderItems on items.order = $self;
}

entity OrderItems: cuid {
  order            : Association to Orders;
  product      : Association to Products;
  quantity           : Integer;
}

entity FinancialData: cuid {
  period               : String;
  revenue              : Decimal;
  expenses             : Decimal;
  profit               : Decimal;
}

entity Customers: cuid {
  salesforceCustomerID : Integer;
  firstName          : String;
  lastName           : String;
  email              : String;
  phone              : String;
  address            : String;
  city               : String;
  country            : String;
}