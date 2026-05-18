import { CustomThrottlerGuard } from './custom-throttler.guard';

describe('CustomThrottlerGuard', () => {
  let guard: CustomThrottlerGuard;

  beforeEach(() => {
    // Instanciamos el guard pasando dependencias vacías/mockeadas
    guard = new CustomThrottlerGuard({} as any, {} as any, {} as any);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('getTracker', () => {
    it('should track by token if Authorization header is present', async () => {
      const mockReq = {
        headers: {
          authorization: 'Bearer my-super-secret-token',
        },
      };

      const result = await (guard as any).getTracker(mockReq);
      expect(result).toBe('token:my-super-secret-token');
    });

    it('should track by x-forwarded-for IP if present', async () => {
      const mockReq = {
        headers: {
          'x-forwarded-for': '203.0.113.195',
        },
        ip: '127.0.0.1',
      };

      const result = await (guard as any).getTracker(mockReq);
      expect(result).toBe('ip:203.0.113.195');
    });

    it('should track by request IP if x-forwarded-for is missing', async () => {
      const mockReq = {
        headers: {},
        ip: '192.168.1.1',
      };

      const result = await (guard as any).getTracker(mockReq);
      expect(result).toBe('ip:192.168.1.1');
    });

    it('should track by remoteAddress if IP and headers are missing', async () => {
      const mockReq = {
        headers: {},
        connection: {
          remoteAddress: '10.0.0.1',
        },
      };

      const result = await (guard as any).getTracker(mockReq);
      expect(result).toBe('ip:10.0.0.1');
    });
  });
});
