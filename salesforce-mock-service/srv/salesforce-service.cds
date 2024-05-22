using { mock.test.salesforce as salesforce } from '../db/schema';

service MockService {
  entity Accounts as projection on salesforce.Accounts;
  entity Contacts as projection on salesforce.Contacts;
  entity Opportunities as projection on salesforce.Opportunities;
  entity BillingAddress as projection on salesforce.BillingAddresses;
}