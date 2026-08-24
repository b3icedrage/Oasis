#!/bin/bash
# Local Android build using EAS
# Run: sh ./scripts/build-android.sh
set -e

echo "🔧 Starting local Android build..."
echo "   Profile: preview"
echo "   Platform: android"
echo ""

# Check for eas-cli
if ! command -v eas &> /dev/null; then
  echo "📦 Installing eas-cli globally..."
  npm install -g eas-cli
fi

# Check auth
if ! eas whoami &> /dev/null; then
  echo "❌ Not logged in to EAS. Run 'eas login' first."
  exit 1
fi

echo "✅ Authenticated as: $(eas whoami)"
echo ""

# Run the local build
eas build \
  --profile preview \
  --platform android \
  --local \
  --non-interactive

echo ""
echo "✅ Build complete! APK will be saved to the current directory."
