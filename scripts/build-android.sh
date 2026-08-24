#!/bin/bash
# Local build using EAS (all platforms, skip fingerprint)
# Run: sh ./scripts/build-android.sh
set -e

export EAS_SKIP_AUTO_FINGERPRINT=1

echo "🔧 Starting local build (all platforms)..."
echo "   Profile: preview"
echo "   Skipping auto-fingerprint"
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

# Run the local build for all platforms
eas build \
  --profile preview \
  --platform all \
  --non-interactive

echo ""
echo "✅ Build complete!"
