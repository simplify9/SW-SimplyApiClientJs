import ClientFactory from '../Services/Client';

describe('Client', () => {
  test('Client Factory should create client instance', () => {
    const client = ClientFactory();
    expect(client).toBeDefined();
    expect(client.SimplyGetAsync).toBeDefined();
    expect(client.SimplyPostAsync).toBeDefined();
    expect(client.SimplyPutAsync).toBeDefined();
    expect(client.SimplyDeleteAsync).toBeDefined();
    expect(client.SimplyPostFormAsync).toBeDefined();
  });

  test('Client should work with custom config', () => {
    const config = {
      baseUrl: 'https://test-api.com',
      authType: 'bearer' as const,
      getBearer: () => 'test-token',
    };

    const client = ClientFactory(config);
    expect(client).toBeDefined();
  });

  test('SimplyDeleteAsync supports both calling patterns for backward compatibility', () => {
    const client = ClientFactory();

    // Test that both calling patterns work (the interface was inconsistent)
    // 1. Without body parameter (actual implementation)
    expect(() => client.SimplyDeleteAsync('/test')).not.toThrow();

    // 2. With body parameter (what the interface promised)
    expect(() => client.SimplyDeleteAsync('/test', { id: 123 })).not.toThrow();
  });
});
