using { mock.test.salesforce as salesforce } from '../db/schema';

service AccountService {
  entity Accounts as projection on salesforce.Account;
}

service ContactService {
  entity Contacts as projection on salesforce.Contact;
}

service OpportunityService {
  entity Opportunities as projection on salesforce.Opportunity;
}