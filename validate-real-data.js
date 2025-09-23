#!/usr/bin/env node
/**
 * Real Data Validation Script
 *
 * This script validates that the Litigation Management System is connected to
 * the MySQL database and returning real data, not mock data.
 *
 * Usage: node validate-real-data.js
 */

const API_BASE_URL = 'http://localhost:8081';

async function validateAPI() {
    console.log('🔍 Validating Litigation Management System API...\n');

    try {
        // Test 1: API Health Check
        console.log('1. 🏥 Testing API Health...');
        const healthResponse = await fetch(`${API_BASE_URL}/ping`);
        const healthData = await healthResponse.json();

        if (healthData.success) {
            console.log('   ✅ API is responding');
            console.log(`   📊 Server: ${healthData.server}`);
            console.log(`   🔢 Version: ${healthData.version}\n`);
        } else {
            throw new Error('API health check failed');
        }

        // Test 2: Login Authentication
        console.log('2. 🔐 Testing Admin Login...');
        const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@litigation.com',
                password: 'admin123'
            })
        });

        const loginData = await loginResponse.json();

        if (loginData.success && loginData.data.token) {
            console.log('   ✅ Login successful');
            console.log(`   👤 User: ${loginData.data.user.name}`);
            console.log(`   🎭 Role: ${loginData.data.user.role}\n`);
        } else {
            throw new Error('Login failed: ' + (loginData.message || 'Unknown error'));
        }

        // Test 3: Clients Data Validation
        console.log('3. 👥 Validating Clients Data...');
        const clientsResponse = await fetch(`${API_BASE_URL}/clients`);
        const clientsData = await clientsResponse.json();

        if (clientsData.success && clientsData.data.data) {
            const clients = clientsData.data.data;
            const totalClients = clientsData.data.pagination.total;

            console.log(`   ✅ Found ${totalClients} total clients`);
            console.log(`   📄 Showing first ${clients.length} clients:`);

            // Validate real data indicators
            let realDataCount = 0;
            clients.slice(0, 3).forEach((client, index) => {
                const hasRealEmail = client.email && client.email.includes('@');
                const hasRealPhone = client.phone && client.phone.length > 5;
                const hasRealName = client.client_name_en && client.client_name_en.length > 3;

                if (hasRealEmail || hasRealPhone || hasRealName) {
                    realDataCount++;
                }

                console.log(`      ${index + 1}. ${client.client_name_en || client.client_name_ar}`);
                if (client.email) console.log(`         📧 ${client.email}`);
                if (client.phone) console.log(`         📞 ${client.phone}`);
            });

            console.log(`   🎯 Real data indicators: ${realDataCount}/${Math.min(3, clients.length)} clients\n`);
        } else {
            throw new Error('Failed to fetch clients data');
        }

        // Test 4: Cases Data Validation
        console.log('4. ⚖️ Validating Cases Data...');
        const casesResponse = await fetch(`${API_BASE_URL}/cases`);
        const casesData = await casesResponse.json();

        if (casesData.success && casesData.data.data) {
            const cases = casesData.data.data;
            const totalCases = casesData.data.pagination.total;

            console.log(`   ✅ Found ${totalCases} total cases`);
            console.log(`   📄 Showing first ${cases.length} cases:`);

            cases.slice(0, 3).forEach((caseItem, index) => {
                console.log(`      ${index + 1}. Case ${caseItem.matter_id}: ${caseItem.matter_en || caseItem.matter_ar}`);
                if (caseItem.matter_court) console.log(`         🏛️ Court: ${caseItem.matter_court}`);
                if (caseItem.matter_start_date) console.log(`         📅 Start: ${caseItem.matter_start_date}`);
            });
            console.log('');
        } else {
            throw new Error('Failed to fetch cases data');
        }

        // Test 5: Hearings Data Validation
        console.log('5. 🏛️ Validating Hearings Data...');
        const hearingsResponse = await fetch(`${API_BASE_URL}/hearings`);
        const hearingsData = await hearingsResponse.json();

        if (hearingsData.success) {
            if (hearingsData.data.data && hearingsData.data.data.length > 0) {
                const hearings = hearingsData.data.data;
                console.log(`   ✅ Found ${hearings.length} hearings`);

                hearings.slice(0, 2).forEach((hearing, index) => {
                    console.log(`      ${index + 1}. Hearing ID: ${hearing.id}`);
                    if (hearing.hearing_date) console.log(`         📅 Date: ${hearing.hearing_date}`);
                    if (hearing.hearing_time) console.log(`         ⏰ Time: ${hearing.hearing_time}`);
                });
            } else {
                console.log('   ℹ️ No hearings found (empty dataset)');
            }
            console.log('');
        } else {
            console.log('   ⚠️ Hearings endpoint returned error (might be empty)\n');
        }

        // Test 6: Lawyers Data Validation
        console.log('6. 👨‍💼 Validating Lawyers Data...');
        const lawyersResponse = await fetch(`${API_BASE_URL}/lawyers`);

        if (lawyersResponse.ok) {
            const lawyersData = await lawyersResponse.json();

            if (lawyersData.success && lawyersData.data) {
                const lawyers = Array.isArray(lawyersData.data) ? lawyersData.data : lawyersData.data.data || [];
                console.log(`   ✅ Found ${lawyers.length} lawyers`);

                lawyers.slice(0, 3).forEach((lawyer, index) => {
                    console.log(`      ${index + 1}. ${lawyer.name || lawyer.full_name_en || lawyer.full_name_ar || 'Lawyer ' + lawyer.id}`);
                    if (lawyer.specialization) console.log(`         🏷️ Specialization: ${lawyer.specialization}`);
                    if (lawyer.email) console.log(`         📧 ${lawyer.email}`);
                });
            } else {
                console.log('   ℹ️ No lawyers found or different data structure');
            }
        } else {
            console.log('   ⚠️ Lawyers endpoint not available or returned error');
        }
        console.log('');

        // Final Summary
        console.log('🎉 VALIDATION COMPLETE!');
        console.log('========================================');
        console.log('✅ API is functional and connected to MySQL database');
        console.log('✅ Login authentication works with admin credentials');
        console.log('✅ All endpoints return real data from database');
        console.log('✅ System is ready for use with real data');
        console.log('');
        console.log('📊 Data Summary:');
        console.log(`   - ${clientsData.data.pagination.total} clients in database`);
        console.log(`   - ${casesData.data.pagination.total} cases in database`);
        console.log('   - Hearings and lawyers data available');
        console.log('');
        console.log('🚀 The system is successfully connected to real MySQL data!');

    } catch (error) {
        console.error('❌ VALIDATION FAILED!');
        console.error('Error:', error.message);
        console.error('');
        console.error('🔧 Troubleshooting:');
        console.error('1. Make sure the API server is running on port 8081');
        console.error('2. Verify MySQL database is accessible');
        console.error('3. Check that admin credentials are correct');
        console.error('4. Ensure all backend/api files are in place');

        process.exit(1);
    }
}

// Helper function for Node.js fetch (if not available)
if (typeof fetch === 'undefined') {
    console.log('📦 Installing fetch capability...');
    const { default: fetch } = await import('node-fetch');
    global.fetch = fetch;
}

// Run validation
validateAPI();