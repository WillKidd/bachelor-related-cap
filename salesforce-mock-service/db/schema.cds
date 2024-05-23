namespace mock.test.salesforce;

using {cuid} from '@sap/cds/common';

entity Accounts : cuid {
  name           : String;
  billingAddress : Association to one BillingAddresses;
  contacts       : Association to many Contacts
                     on contacts.account = $self;
  opportunities  : Association to many Opportunities
                     on opportunities.account = $self;
}

entity Contacts : cuid {
  account   : Association to one Accounts;
  firstName : String;
  lastName  : String;
  email     : String;
  phone     : String;
}

entity Opportunities : cuid {
  account   : Association to one Accounts;
  name      : String;
  stageName : String;
  closeDate : Date;
  items     : Association to many OpportunityItems;
  amount    : Decimal;
}

entity OpportunityItems : cuid {
  product     : Association to one Products;
  opportunity : Association to one Opportunities;
  quantity    : Integer;
  unitPrice   : Decimal;
  totalPrice  : Decimal;
}

entity Products : cuid {
  name        : String;
  description : String;
  price       : Decimal;
  category    : String;
}

entity BillingAddresses : cuid {
  account    : Association to one Accounts
                 on account.billingAddress = $self;
  street     : String;
  city       : String;
  state      : String;
  postalCode : String;
  country    : String;
}
