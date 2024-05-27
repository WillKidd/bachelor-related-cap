using { mock.test.salesforce as salesforce } from '../db/schema';

service MockService {
  entity Customers as projection on salesforce.Customers;
  entity Tickets as projection on salesforce.Tickets;
  entity Interactions as projection on salesforce.Interactions;
  entity Opportunities as projection on salesforce.Opportunities;
  entity BillingAddresses as projection on salesforce.BillingAddresses;
}