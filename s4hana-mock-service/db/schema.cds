namespace mock.test.s4hana;

using {cuid} from '@sap/cds/common';

entity Products : cuid {
  name        : String;
  description : String;

  price       : Decimal;
  category    : String;
}

entity Inventory : cuid {
  product  : Association to Products;

  location : String;

  quantity : Integer;
}

entity Orders : cuid {
  customer    : Association to one Customers;
  orderDate   : Date;
  totalAmount : Decimal;
  status      : String;

  items       : Composition of many OrderItems
                  on items.order = $self;
}

entity OrderItems : cuid {
  order    : Association to Orders;

  product  : Association to Products;

  quantity : Integer;
}

entity Customers : cuid {
  salesforceCustomerID : UUID;
  firstName            : String;
  lastName             : String;

  email                : String;
  phone                : String;

  billingAddress       : Composition of BillingAddresses;
}

entity BillingAddresses : cuid {
    customer    : Association to one Customers
                 on customer.billingAddress = $self;
  street     : String;
  city       : String;
  state      : String;
  postalCode : String;
  country    : String;
}
