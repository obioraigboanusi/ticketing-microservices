import { jest } from '@jest/globals';
import { natsWrapper } from '../nats.js';

declare global {
  var signin: () => string[];
}

type PublishFn = (
  subject: string,
  data: string,
  callback: (err?: Error | null, guid?: string) => void,
) => void;

beforeAll(async () => {
  process.env.JWT_KEY = 'test-jwt-key';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (natsWrapper as any)._client = {
    publish: jest
      .fn<PublishFn>()
      .mockImplementation(
        (
          _subject: string,
          _data: string,
          callback: (err?: Error | null, guid?: string) => void,
        ) => {
          callback(null, 'test-guid');
        },
      ),
  };
}, 60000);

beforeEach(async () => {
  jest.clearAllMocks();
});
