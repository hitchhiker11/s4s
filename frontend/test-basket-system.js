/**
 * Test script for the new basket system with fuser_id
 * 
 * This script can be run in the browser console to test
 * the basket functionality manually.
 * 
 * Usage:
 * 1. Open browser console on the site
 * 2. Copy and paste this script
 * 3. Run the test functions
 */

// Test localStorage utilities
function testBasketUtils() {
  console.log('=== Testing basketUtils ===');
  
  // Import the utilities (this would work in a real React component)
  // const { getStoredFuserId, storeFuserId, clearStoredFuserId } = require('./src/lib/basketUtils');
  
  // Simulate the functions for testing
  const FUSER_ID_STORAGE_KEY = 'shop4shoot_fuser_id';
  const FUSER_ID_EXPIRY_KEY = 'shop4shoot_fuser_id_expiry';
  
  // Clear any existing data
  localStorage.removeItem(FUSER_ID_STORAGE_KEY);
  localStorage.removeItem(FUSER_ID_EXPIRY_KEY);
  console.log('✓ Cleared existing fuser_id');
  
  // Test storing fuser_id
  const testFuserId = '123456789';
  const expiryTime = new Date().getTime() + (365 * 24 * 60 * 60 * 1000);
  localStorage.setItem(FUSER_ID_STORAGE_KEY, testFuserId);
  localStorage.setItem(FUSER_ID_EXPIRY_KEY, expiryTime.toString());
  console.log('✓ Stored test fuser_id:', testFuserId);
  
  // Test retrieving fuser_id
  const retrievedId = localStorage.getItem(FUSER_ID_STORAGE_KEY);
  const retrievedExpiry = localStorage.getItem(FUSER_ID_EXPIRY_KEY);
  console.log('✓ Retrieved fuser_id:', retrievedId);
  console.log('✓ Retrieved expiry:', new Date(parseInt(retrievedExpiry)).toISOString());
  
  // Test expiry check
  const now = new Date().getTime();
  const isExpired = parseInt(retrievedExpiry) < now;
  console.log('✓ Is expired:', isExpired);
  
  return retrievedId === testFuserId;
}

// Test API endpoints (requires actual network)
async function testBasketAPI() {
  console.log('=== Testing Basket API ===');
  
  try {
    // Test getting basket without fuser_id (should initialize new one)
    console.log('Testing GET /api/basket without fuser_id...');
    const initResponse = await fetch('/api/basket');
    const initData = await initResponse.json();
    console.log('✓ Init response:', initData);
    
    if (initData.meta && initData.meta.fuser_id) {
      const fuserId = initData.meta.fuser_id;
      console.log('✓ Got fuser_id:', fuserId);
      
      // Test getting basket with fuser_id
      console.log('Testing GET /api/basket with fuser_id...');
      const getResponse = await fetch(`/api/basket?fuser_id=${fuserId}`);
      const getData = await getResponse.json();
      console.log('✓ Get response:', getData);
      
      // Test adding item to basket
      console.log('Testing POST /api/basket...');
      const addResponse = await fetch('/api/basket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fuser_id: fuserId,
          product_id: 8194,
          quantity: 1,
          properties: {}
        })
      });
      const addData = await addResponse.json();
      console.log('✓ Add response:', addData);
      
      return true;
    } else {
      console.error('✗ No fuser_id in response');
      return false;
    }
  } catch (error) {
    console.error('✗ API test failed:', error);
    return false;
  }
}

// Test localStorage persistence
function testPersistence() {
  console.log('=== Testing Persistence ===');
  
  const FUSER_ID_STORAGE_KEY = 'shop4shoot_fuser_id';
  
  // Store a test ID
  const testId = 'test_' + Date.now();
  localStorage.setItem(FUSER_ID_STORAGE_KEY, testId);
  console.log('✓ Stored test ID:', testId);
  
  // Simulate page reload by retrieving it
  const retrievedId = localStorage.getItem(FUSER_ID_STORAGE_KEY);
  console.log('✓ Retrieved after "reload":', retrievedId);
  
  return retrievedId === testId;
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Starting Basket System Tests');
  console.log('================================');
  
  const results = {
    utils: testBasketUtils(),
    persistence: testPersistence(),
    api: await testBasketAPI()
  };
  
  console.log('================================');
  console.log('📊 Test Results:');
  console.log('Utils:', results.utils ? '✅ PASS' : '❌ FAIL');
  console.log('Persistence:', results.persistence ? '✅ PASS' : '❌ FAIL');
  console.log('API:', results.api ? '✅ PASS' : '❌ FAIL');
  
  const allPassed = Object.values(results).every(result => result === true);
  console.log('Overall:', allPassed ? '🎉 ALL TESTS PASSED' : '⚠️ SOME TESTS FAILED');
  
  return results;
}

// Export for manual testing
if (typeof window !== 'undefined') {
  window.testBasketSystem = {
    runAllTests,
    testBasketUtils,
    testBasketAPI,
    testPersistence
  };
  
  console.log('🔧 Basket test functions available:');
  console.log('- window.testBasketSystem.runAllTests()');
  console.log('- window.testBasketSystem.testBasketUtils()');
  console.log('- window.testBasketSystem.testBasketAPI()');
  console.log('- window.testBasketSystem.testPersistence()');
} 