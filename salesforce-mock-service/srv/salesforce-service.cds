using { mock.test.salesforce as salesforce } from '../db/schema';

service MockService {
  entity Accounts as projection on salesforce.Account;
  entity Contacts as projection on salesforce.Contact;
  entity Opportunities as projection on salesforce.Opportunity;
}