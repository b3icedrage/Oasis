#!/bin/bash
# GlitchIt APK Signing Setup
# Run this once to generate your signing keystore

set -e

KEYSTORE_FILE="glitchit.keystore"
ALIAS="glitchit"
VALIDITY=10000

echo "🔧 GlitchIt APK Signing Setup"
echo "=============================="
echo ""

# Check if keystore already exists
if [ -f "$KEYSTORE_FILE" ]; then
    echo "⚠️  Keystore already exists: $KEYSTORE_FILE"
    read -p "Overwrite? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 0
    fi
fi

# Prompt for passwords
read -sp "Enter keystore password: " STORE_PASS
echo
read -sp "Confirm keystore password: " STORE_PASS_CONFIRM
echo

if [ "$STORE_PASS" != "$STORE_PASS_CONFIRM" ]; then
    echo "❌ Passwords don't match!"
    exit 1
fi

read -sp "Enter key password (can be same as keystore): " KEY_PASS
echo

echo ""
echo "📝 Generating keystore..."

keytool -genkey -v \
    -keystore "$KEYSTORE_FILE" \
    -alias "$ALIAS" \
    -keyalg RSA \
    -keysize 2048 \
    -validity "$VALIDITY" \
    -storepass "$STORE_PASS" \
    -keypass "$KEY_PASS" \
    -dname "CN=GlitchIt, OU=Development, O=GlitchIt, L=Unknown, ST=Unknown, C=US"

echo ""
echo "✅ Keystore generated: $KEYSTORE_FILE"
echo ""
echo "📦 Now set up GitHub Secrets:"
echo "   1. base64 -w 0 $KEYSTORE_FILE | pbcopy  (Mac) or xclip"
echo "   2. Go to GitHub → Repo → Settings → Secrets → Actions"
echo "   3. Add these secrets:"
echo "      - KEYSTORE_BASE64  (the base64 string)"
echo "      - KEYSTORE_PASSWORD  ($STORE_PASS)"
echo "      - KEY_PASSWORD  ($KEY_PASS)"
echo "      - KEY_ALIAS  ($ALIAS)"
echo ""
echo "🚀 Then push to GitHub — the APK will be built automatically!"
