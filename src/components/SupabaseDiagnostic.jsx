import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import Button from './Button';
import AlertMessage from './AlertMessage';

/**
 * Supabase Diagnostic Component
 * Helps debug Supabase connection and RLS policy issues
 * 
 * Usage: Add to admin pages or development pages
 * <SupabaseDiagnostic />
 */
function SupabaseDiagnostic() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testsDone, setTestsDone] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    setTestsDone(false);
    const testResults = {
      supabaseConfigured: false,
      connectionTest: null,
      donorsTableExists: false,
      donorRecords: 0,
      rlsEnabled: null,
      selectPolicy: null,
      insertPolicy: null,
      updatePolicy: null,
      deletePolicy: null,
      sampleQuery: null,
      errors: [],
    };

    try {
      // Test 1: Check if Supabase is configured
      testResults.supabaseConfigured = isSupabaseConfigured();
      if (!testResults.supabaseConfigured) {
        testResults.errors.push('Supabase not configured - check .env file');
        setResults(testResults);
        setLoading(false);
        setTestsDone(true);
        return;
      }

      // Test 2: Connection test
      try {
        const { data, error } = await supabase.auth.getSession();
        testResults.connectionTest = {
          success: !error,
          authenticated: !!data?.session,
          error: error?.message,
        };
      } catch (err) {
        testResults.connectionTest = {
          success: false,
          error: err.message,
        };
        testResults.errors.push(`Connection test failed: ${err.message}`);
      }

      // Test 3: Check if donors table exists and query it
      try {
        const { data, error, count } = await supabase
          .from('donors')
          .select('*', { count: 'exact' })
          .limit(10);

        if (error) {
          testResults.donorsTableExists = false;
          testResults.errors.push(`Donors table query failed: ${error.message}`);
          if (error.message.includes('policy')) {
            testResults.errors.push('→ Likely cause: RLS policy restricting SELECT access');
          }
        } else {
          testResults.donorsTableExists = true;
          testResults.donorRecords = count || data?.length || 0;
          testResults.sampleQuery = {
            success: true,
            recordCount: testResults.donorRecords,
            sampleRecord: data?.[0] ? {
              id: data[0].id,
              blood_group: data[0].blood_group,
              city: data[0].city,
              available: data[0].available,
            } : null,
          };
        }
      } catch (err) {
        testResults.errors.push(`Database error: ${err.message}`);
      }

      // Test 4: Check RLS policies via information schema
      try {
        const { data, error } = await supabase
          .from('information_schema')
          .select('*')
          .eq('table_name', 'donors');

        if (!error && data) {
          testResults.rlsEnabled = true;
        }
      } catch (err) {
        // RLS info might not be accessible, continue
        console.log('Could not query RLS info (expected)');
      }

      // Test 5: Try a filtered query
      try {
        const { data, error } = await supabase
          .from('donors')
          .select('id, blood_group, city')
          .eq('blood_group', 'O+')
          .limit(5);

        if (error) {
          testResults.selectPolicy = {
            success: false,
            error: error.message,
          };
        } else {
          testResults.selectPolicy = {
            success: true,
            recordsFound: data?.length || 0,
          };
        }
      } catch (err) {
        testResults.selectPolicy = {
          success: false,
          error: err.message,
        };
      }
    } catch (err) {
      testResults.errors.push(`General error: ${err.message}`);
    } finally {
      setResults(testResults);
      setLoading(false);
      setTestsDone(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 my-6">
      <h3 className="text-lg font-bold mb-4">🔧 Supabase Diagnostics</h3>
      
      <Button
        onClick={runDiagnostics}
        loading={loading}
        variant="secondary"
        className="mb-4"
      >
        {testsDone ? 'Run Diagnostics Again' : 'Run Diagnostics'}
      </Button>

      {results && (
        <div className="space-y-4">
          {/* Configuration */}
          <div className={`p-4 rounded border-l-4 ${results.supabaseConfigured ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
            <div className="font-semibold text-sm">
              {results.supabaseConfigured ? '✅' : '❌'} Supabase Configuration
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {results.supabaseConfigured ? 'Credentials found in .env' : 'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY'}
            </div>
          </div>

          {/* Connection */}
          {results.connectionTest && (
            <div className={`p-4 rounded border-l-4 ${results.connectionTest.success ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
              <div className="font-semibold text-sm">
                {results.connectionTest.success ? '✅' : '❌'} Supabase Connection
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {results.connectionTest.authenticated ? 'Authenticated user' : 'Not authenticated'}
                {results.connectionTest.error && ` - Error: ${results.connectionTest.error}`}
              </div>
            </div>
          )}

          {/* Donors Table */}
          <div className={`p-4 rounded border-l-4 ${results.donorsTableExists ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
            <div className="font-semibold text-sm">
              {results.donorsTableExists ? '✅' : '❌'} Donors Table
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {results.donorsTableExists 
                ? `Found ${results.donorRecords} donor records`
                : 'Table not found or not accessible'
              }
            </div>
          </div>

          {/* Sample Query */}
          {results.sampleQuery?.success && (
            <div className="p-4 rounded border-l-4 bg-blue-50 border-blue-500">
              <div className="font-semibold text-sm">✅ Sample Query Result</div>
              <div className="text-xs text-gray-600 mt-1">
                <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-32">
                  {JSON.stringify(results.sampleQuery.sampleRecord, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Select Policy */}
          {results.selectPolicy && (
            <div className={`p-4 rounded border-l-4 ${results.selectPolicy.success ? 'bg-green-50 border-green-500' : 'bg-orange-50 border-orange-500'}`}>
              <div className="font-semibold text-sm">
                {results.selectPolicy.success ? '✅' : '⚠️'} SELECT Policy Test
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {results.selectPolicy.success 
                  ? `Can query donors: ${results.selectPolicy.recordsFound} records found`
                  : `Error: ${results.selectPolicy.error}`
                }
              </div>
            </div>
          )}

          {/* Errors */}
          {results.errors.length > 0 && (
            <AlertMessage
              type="error"
              message={`${results.errors.length} issue(s) found:`}
              onClose={() => {}}
            >
              <ul className="mt-2 text-xs space-y-1">
                {results.errors.map((err, idx) => (
                  <li key={idx}>• {err}</li>
                ))}
              </ul>
            </AlertMessage>
          )}

          {/* Success */}
          {results.errors.length === 0 && testsDone && (
            <AlertMessage
              type="success"
              message="✅ All checks passed! Supabase is properly configured."
              onClose={() => {}}
            />
          )}

          {/* JSON Export */}
          <details className="text-xs">
            <summary className="cursor-pointer font-semibold text-gray-600 hover:text-gray-900">
              View Raw Results (JSON)
            </summary>
            <pre className="bg-gray-100 p-3 rounded mt-2 overflow-auto max-h-40">
              {JSON.stringify(results, null, 2)}
            </pre>
          </details>
        </div>
      )}

      <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600 border-l-4 border-gray-300">
        <strong>ℹ️ Note:</strong> This diagnostic tool requires you to be authenticated. 
        If you're not logged in, the tests will fail. Log in first, then run diagnostics.
      </div>
    </div>
  );
}

export default SupabaseDiagnostic;
