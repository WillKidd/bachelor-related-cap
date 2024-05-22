namespace mock.test.salesforce;
using {cuid} from '@sap/cds/common';

entity Accounts :cuid {
  name             : String;
  billingAddress:   Association to one BillingAddresses;
  contacts         : Association to many Contacts on contacts.account = $self;
  opportunities    : Association to many Opportunities on opportunities.account = $self;
}

entity Contacts: cuid {
  account        : Association to one Accounts;
  firstName        : String;
  lastName         : String;
  email            : String;
  phone            : String;
}

entity Opportunities: cuid {
  account        : Association to one Accounts;
  name             : String;
  stageName        : String;
  closeDate        : Date;
  amount           : Decimal;
}

entity BillingAddresses : cuid {
  street        : String;
  city          : String;
  state         : String;
  postalCode    : String;
  country       : String;
  account       : Association to one Accounts on account.billingAddress = $self;
}