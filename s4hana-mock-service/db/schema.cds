namespace mock.test.s4hana;
using {cuid} from '@sap/cds/common';

entity Products: cuid {
  name               : String;
  description        : String;
  price              : Decimal;
  category           : String;
}

entity Inventory: cuid {
  productID      : UUID;
  location           : String;
  quantity           : Integer;
}

entity Orders: cuid {
  customerID       : UUID;
  orderDate          : Date;
  totalAmount        : Decimal;
  status             : String;
  items              : Composition of many OrderItems on items.orderId = ID;
}

entity OrderItems: cuid {
  orderId            : UUID;
  productID      : UUID;
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