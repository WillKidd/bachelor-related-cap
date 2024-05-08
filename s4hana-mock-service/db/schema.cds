namespace mock.test.s4hana;

entity Products {
  key ID             : Integer;
  name               : String;
  description        : String;
  price              : Decimal;
  category           : String;
  availability       : Boolean;
}

entity Inventory {
  key ID             : Integer;
  productID      : String;
  location           : String;
  quantity           : Integer;
}

entity Orders {
  key ID             : Integer;
  customerName       : String;
  orderDate          : Date;
  totalAmount        : Decimal;
  status             : String;
  items              : Composition of many OrderItems on items.orderId = ID;
}

entity OrderItems {
  key ID             : Integer;
  orderId            : String;
  productID      : String;
  quantity           : Integer;
  price              : Decimal;
}

entity FinancialData {
  key ID             : Integer;
  period               : String;
  revenue              : Decimal;
  expenses             : Decimal;
  profit               : Decimal;
}

entity Customers {
  key ID             : Integer;
  salesforceCustomerID : Integer;
  firstName          : String;
  lastName           : String;
  email              : String;
  phone              : String;
  address            : String;
  city               : String;
  country            : String;
}