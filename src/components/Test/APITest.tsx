import React, { useState } from 'react';
import { testAPIEndpoints } from '../../utils/apiTest';

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

const APITest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState<{
    total: number;
    success: number;
    failed: number;
    corsIssues: number;
    avgResponseTime: number;
  }>({
    total: 0,
    success: 0,
    failed: 0,
    corsIssues: 0,
    avgResponseTime: 0,
  });

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    const results = await testAPIEndpoints();
    setTestResults(results);

    // Calculate summary
    const successfulTests = results.filter(r => r.status === 'success');
    const failedTests = results.filter(r => r.status === 'error');
    const corsIssues = results.filter(r => r.details?.cors === false).length;
    const avgResponseTime = results.reduce((acc, r) => acc + (r.details?.responseTime || 0), 0) / results.length;

    setSummary({
      total: results.length,
      success: successfulTests.length,
      failed: failedTests.length,
      corsIssues,
      avgResponseTime,
    });

    setIsRunning(false);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        API Integration Test
      </h2>
      
      <button
        onClick={runTests}
        disabled={isRunning}
        className={`px-4 py-2 rounded-md text-white ${
          isRunning
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isRunning ? 'Running Tests...' : 'Run API Tests'}
      </button>

      {testResults.length > 0 && (
        <>
          {/* Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Tests</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{summary.total}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm text-green-500 dark:text-green-400">Successful</p>
              <p className="text-2xl font-semibold text-green-700 dark:text-green-300">{summary.success}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-sm text-red-500 dark:text-red-400">Failed</p>
              <p className="text-2xl font-semibold text-red-700 dark:text-red-300">{summary.failed}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-sm text-yellow-500 dark:text-yellow-400">CORS Issues</p>
              <p className="text-2xl font-semibold text-yellow-700 dark:text-yellow-300">{summary.corsIssues}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-500 dark:text-blue-400">Avg Response Time</p>
              <p className="text-2xl font-semibold text-blue-700 dark:text-blue-300">
                {Math.round(summary.avgResponseTime)}ms
              </p>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="mt-6 space-y-4">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-md ${
                  result.status === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-medium">{result.endpoint}</span>
                    <span className="ml-2 text-sm">
                      {result.status === 'success' ? '✓' : '✗'}
                    </span>
                  </div>
                  {result.details && (
                    <div className="text-sm">
                      {result.details.responseTime && (
                        <span className="mr-4">Response: {result.details.responseTime}ms</span>
                      )}
                      {result.details.statusCode && (
                        <span className="mr-4">Status: {result.details.statusCode}</span>
                      )}
                      {result.details.cors !== undefined && (
                        <span className={result.details.cors ? 'text-green-500' : 'text-red-500'}>
                          CORS: {result.details.cors ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <p className="mt-1 text-sm">{result.message}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Testing Instructions
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
          <li>Ensure the backend server is running</li>
          <li>Check the browser console for detailed request/response logs</li>
          <li>Verify CORS headers in the Network tab</li>
          <li>Monitor backend logs for incoming requests</li>
          <li>Check response times and status codes</li>
          <li>Verify successful redirection after login</li>
        </ol>
      </div>
    </div>
  );
};

export default APITest; 