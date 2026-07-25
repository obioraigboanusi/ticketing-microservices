export enum Subjects {
  TicketCreated = "ticket:created",
  TicketUpdated = "ticket:updated",
}

export interface Event {
  subject: Subjects;
  data: any;
}
