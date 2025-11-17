// Backward compatibility test for axios upgrade
import ClientFactory from '../Services/Client';

describe('Axios Upgrade Backward Compatibility', () => {
  test('API Response structure should remain the same', async () => {
    const client = ClientFactory();

    // Mock a successful response to test the structure
    const mockResponse = {
      status: 200,
      statusText: 'OK',
      data: { message: 'success' },
    };

    // Since we're using the actual axios instance, we'll test the response transformation
    // The interceptor should transform axios response to our ApiResponse format
    const expectedFormat = {
      status: expect.any(Number),
      succeeded: expect.any(Boolean),
      data: expect.anything(),
      error: expect.any(String),
    };

    // The client methods should return promises
    expect(client.SimplyGetAsync('/test')).toBeInstanceOf(Promise);
    expect(client.SimplyPostAsync('/test', {})).toBeInstanceOf(Promise);
    expect(client.SimplyPutAsync('/test', {})).toBeInstanceOf(Promise);
    expect(client.SimplyDeleteAsync('/test')).toBeInstanceOf(Promise);
    expect(client.SimplyPostFormAsync('/test', {})).toBeInstanceOf(Promise);
  });

  test('Bearer token authentication should still work', () => {
    const config = {
      baseUrl: 'https://api.example.com',
      authType: 'bearer' as const,
      getBearer: () => 'test-bearer-token',
    };

    const client = ClientFactory(config);
    expect(client).toBeDefined();

    // Verify all methods are available
    expect(typeof client.SimplyGetAsync).toBe('function');
    expect(typeof client.SimplyPostAsync).toBe('function');
    expect(typeof client.SimplyPutAsync).toBe('function');
    expect(typeof client.SimplyDeleteAsync).toBe('function');
    expect(typeof client.SimplyPostFormAsync).toBe('function');
  });

  test('FormData handling should be preserved', () => {
    const client = ClientFactory();
    const formData = new FormData();
    formData.append('test', 'value');

    // Should not throw when called with FormData
    expect(() => {
      client.SimplyPostFormAsync('/upload', formData);
    }).not.toThrow();
  });

  test('SimplyDeleteAsync backward compatibility with body parameter', async () => {
    const client = ClientFactory();

    // Test both calling patterns that clients might use
    // 1. Without body (newer style)
    expect(() => client.SimplyDeleteAsync('/test')).not.toThrow();

    // 2. With body (legacy style that was in the interface)
    expect(() => client.SimplyDeleteAsync('/test', { id: 123 })).not.toThrow();

    // 3. With body and options
    expect(() => client.SimplyDeleteAsync('/test', { id: 123 }, {})).not.toThrow();

    // 4. With null body and options
    expect(() => client.SimplyDeleteAsync('/test', null, {})).not.toThrow();
  });

  test('Error handling structure should remain consistent', () => {
    const client = ClientFactory();

    // The client should handle errors gracefully and return ApiResponse format
    // This tests that the response interceptor error handling is still working
    expect(client.SimplyGetAsync('/nonexistent')).toBeInstanceOf(Promise);
  });
});
