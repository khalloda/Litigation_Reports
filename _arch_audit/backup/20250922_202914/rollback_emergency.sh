#!/bin/bash
# EMERGENCY ROLLBACK SCRIPT
# Execute this if migration fails at any point

echo "🚨 EMERGENCY ROLLBACK INITIATED 🚨"
echo "Restoring original repository state..."

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"

cd "$REPO_ROOT"

echo "Working directory: $(pwd)"

# Restore API files if they were removed
if [ -f "$SCRIPT_DIR/api-server.php" ]; then
    cp "$SCRIPT_DIR/api-server.php" .
    echo "✅ Restored api-server.php"
fi

if [ -f "$SCRIPT_DIR/router.php" ]; then
    cp "$SCRIPT_DIR/router.php" .
    echo "✅ Restored router.php"
fi

if [ -f "$SCRIPT_DIR/api-test.php" ]; then
    cp "$SCRIPT_DIR/api-test.php" .
    echo "✅ Restored api-test.php"
fi

# Restore config directory if it was removed
if [ -d "$SCRIPT_DIR/config_original" ]; then
    cp -r "$SCRIPT_DIR/config_original" ./config
    echo "✅ Restored config/ directory"
fi

# Restore test files if they were moved
if [ -d "$SCRIPT_DIR/test_files_original" ]; then
    cp "$SCRIPT_DIR/test_files_original"/* .
    echo "✅ Restored test files to root"
fi

echo ""
echo "🔄 ROLLBACK COMPLETE"
echo "⚠️  Please verify all functionality works correctly"
echo "🧪 Run tests: npm run test && npm run test:e2e"
echo "🔍 Check API: Test all endpoints manually"
echo "📋 Validate: Ensure all features work as before migration"

echo ""
echo "If rollback successful, investigate migration failure and retry with fixes."
echo "Contact: Principal Software Architect for migration support"