<?php

/**
 * API Consolidation Test
 *
 * Tests that the new API structure is working correctly.
 */

// Test API endpoints
$testEndpoints = [
    'http://localhost:8000/api/ping',
    'http://localhost:8000/api/health',
];

echo "🧪 Testing API Consolidation\n";
echo "==============================\n\n";

foreach ($testEndpoints as $endpoint) {
    echo "Testing: $endpoint\n";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);

    curl_close($ch);

    if ($error) {
        echo "❌ ERROR: $error\n\n";
        continue;
    }

    if ($httpCode !== 200) {
        echo "❌ HTTP $httpCode: Invalid response\n\n";
        continue;
    }

    $data = json_decode($response, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo "❌ Invalid JSON response\n\n";
        continue;
    }

    if (isset($data['success']) && $data['success'] === true) {
        echo "✅ SUCCESS: API endpoint working\n";
        if (isset($data['message'])) {
            echo "   Message: {$data['message']}\n";
        }
        if (isset($data['version'])) {
            echo "   Version: {$data['version']}\n";
        }
    } else {
        echo "❌ API returned error: " . ($data['error'] ?? 'Unknown error') . "\n";
    }

    echo "\n";
}

echo "🔧 Next Steps:\n";
echo "1. Start the API server: php -S localhost:8000 apps/api/api-server.php\n";
echo "2. Start the frontend: npm run dev\n";
echo "3. Test full integration\n\n";

echo "📊 API Structure Test Complete\n";
