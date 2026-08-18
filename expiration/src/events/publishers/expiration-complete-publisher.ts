import { BasePublisher, Subjects, type ExpirationCompleteEvent } from '@cwertlinks/common';

export class ExpirationCompletePublisher extends BasePublisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
