namespace mock.test.salesforce;

entity Account {
  key ID           : Integer;
  name             : String;
  phone            : String;
  billingCity      : String;
  billingCountry   : String;
  contacts         : Association to many Contact on contacts.accountID = ID;
  opportunities    : Association to many Opportunity on opportunities.accountID = ID;
}

entity Contact {
  key ID           : Integer;
  accountID        : Integer;
  firstName        : String;
  lastName         : String;
  email            : String;
  phone            : String;
}

entity Opportunity {
  key ID           : Integer;
  accountID        : Integer;
  name             : String;
  stageName        : String;
  closeDate        : Date;
  amount           : Decimal;
}