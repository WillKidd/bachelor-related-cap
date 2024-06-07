namespace mock.test.salesforce;

using {cuid} from '@sap/cds/common';

entity Customers : cuid {
  firstName : String;
  lastName  : String;
  email     : String;
  phone     : String;
  tickets: Composition of many Tickets;
  billingAddress: Composition of BillingAddresses;
  interactions: Composition of many Interactions;
  opportunities: Composition of many Opportunities;
}

type TicketType : String enum {
  question;   // Anfrage zu Informationen oder Details
  issue;      // Meldung eines Problems oder Fehlers
  request;    // Anforderung für eine Dienstleistung oder Änderung
}

type TicketStatus : String enum {
  open;       // Offen und noch nicht bearbeitet
  inProgress; // In Bearbeitung
  resolved;   // Gelöst
  closed;     // Geschlossen
}

entity Tickets : cuid {
  customer: Association to one Customers;
  type: TicketType;
  subject: String;
  description: String;
  status: TicketStatus;
  priority: String;
  createdOn: Date;
  resolvedOn: Date;
}

type InteractionType : String enum {
  call;         // Telefonanruf
  email;        // E-Mail-Austausch
  meeting;      // Persönliches Treffen
  socialMedia;  // Interaktion über soziale Medien
  web;          // Interaktion über Webseite (z.B. Chat)
}

entity Interactions : cuid {
  customer: Association to one Customers;
  date: Date;
  type: InteractionType;
  details: String;
}

type OpportunityType : String enum {
  newBusiness;     // Neue Geschäftsmöglichkeit
  upsell;          // Up-Selling zu einem bestehenden Kunden
  crossSell;       // Cross-Selling zusätzlicher Produkte
  renewal;         // Erneuerung eines Vertrags oder Abonnements
}

type OpportunityStage : String enum {
  initialContact;  // Erster Kontakt
  needsAnalysis;   // Bedarfsanalyse
  proposal;        // Angebotserstellung
  negotiation;     // Verhandlung
  decision;        // Entscheidung
  closedWon;       // Abgeschlossen (gewonnen)
  closedLost;      // Abgeschlossen (verloren)
}

entity Opportunities : cuid {
  customer   : Association to one Customers;
  type: OpportunityType;
  name      : String;
  stageName : OpportunityStage;
  closeDate : Date;
  potentialRevenue    : Decimal;
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
