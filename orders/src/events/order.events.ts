import {
  BasePublisher,
  Subjects,
  type OrderCancelledEvent,
  type OrderCreatedEvent,
} from '@cwertlinks/common';

export class OrderCreatedPublisher extends BasePublisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}

export class OrderCancelledPublisher extends BasePublisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
