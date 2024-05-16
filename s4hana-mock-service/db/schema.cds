namespace mock.test.s4hana;
using {cuid} from '@sap/cds/common';

entity Products: cuid {
  @mandatory
  name               : String;
  description        : String;
  @mandatory
  price              : Decimal;
  category           : String;
}

entity Inventory: cuid {
  @mandatory
  product      : Association to Products;
  @mandatory
  location           : String;
  @mandatory
  quantity           : Integer;
}

entity Orders: cuid {
  @mandatory
  customer       : Association to Customers;
  @mandatory
  orderDate          : Date;
  @mandatory
  totalAmount        : Decimal;
  @mandatory
  status             : String;
  @mandatory
  items              : Composition of many OrderItems on items.order = $self;
}

entity OrderItems: cuid {
  @mandatory
  order            : Association to Orders;
  @mandatory
  product      : Association to Products;
  @mandatory
  quantity           : Integer;
}

entity FinancialData: cuid {
  period               : String;
  revenue              : Decimal;
  expenses             : Decimal;
  profit               : Decimal;
}

entity Customers: cuid {
  @mandatory
  salesforceCustomerID : Integer;
  firstName          : String;
  lastName           : String;
  @mandatory
  email              : String;
  phone              : String;
  @mandatory
  address            : String;
  @mandatory
  city               : String;
  @mandatory
  country            : String;
}