import { BasePublisher, Subjects, type PaymentCreatedEvent } from '@cwertlinks/common';

export class PaymentCreatedPublisher extends BasePublisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
