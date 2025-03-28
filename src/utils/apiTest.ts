import { authAPI, documentAPI } from '../services/api';

interface TestResult {
  endpoint: string;
  status: 'success' | 'error';
  message: string;
  details?: {
    cors?: boolean;
    responseTime?: number;
    statusCode?: number;
  };
}

export const testAPIEndpoints = async (): Promise<TestResult[]> => {
  const results: TestResult[] = [];

  const testEndpoint = async (
    name: string,
    testFn: () => Promise<any>,
    expectedStatus?: number
  ) => {
    const startTime = Date.now();
    try {
      const response = await testFn();
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      results.push({
        endpoint: name,
        status: 'success',
        message: `${name} endpoint working`,
        details: {
          cors: true,
          responseTime,
          statusCode: response.status || 200,
        },
      });
    } catch (error: any) {
      results.push({
        endpoint: name,
        status: 'error',
        message: `${name} endpoint error: ${error.message}`,
        details: {
          cors: !error.message.includes('CORS'),
          statusCode: error.response?.status,
        },
      });
    }
  };

  try {
    // Test login endpoint
    await testEndpoint('/auth/login', () =>
      authAPI.login('test@example.com', 'password')
    );

    // Test token verification
    await testEndpoint('/auth/verify', () => authAPI.verifyToken());

    // Test document upload
    const testFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    await testEndpoint('/documents/upload', () =>
      documentAPI.uploadDocument(testFile)
    );

    // Test recent verifications
    await testEndpoint('/documents/recent', () =>
      documentAPI.getRecentVerifications()
    );

    // Test notifications
    await testEndpoint('/documents/notifications', () =>
      documentAPI.getNotifications()
    );

    return results;
  } catch (error) {
    console.error('API test error:', error);
    return results;
  }
}; 