export type TicketStatus = "open" | "in-progress" | "closed";

export type TicketPriority = "low" | "medium" | "high";

export interface Ticket {
  _id: string;
  title: string;
  message: string;
  email: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
}
