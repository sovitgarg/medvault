#!/bin/bash

# MedVault AWS Amplify Deployment Script
# This script deploys the MedVault app to AWS Amplify

set -e  # Exit on error

echo "🏥 MedVault Deployment Script"
echo "=============================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed${NC}"
    echo "Install it with: brew install awscli (macOS) or pip install awscli"
    exit 1
fi

# Check if Amplify CLI is installed
if ! command -v amplify &> /dev/null; then
    echo -e "${BLUE}📦 Installing Amplify CLI...${NC}"
    npm install -g @aws-amplify/cli
fi

echo -e "${BLUE}🔨 Building application...${NC}"
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed - dist folder not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"
echo ""
echo "📋 Next steps to deploy to AWS Amplify:"
echo "1. Go to: https://console.aws.amazon.com/amplify"
echo "2. Click 'New app' → 'Deploy without Git provider'"
echo "3. Drag and drop the 'dist' folder"
echo "4. Or use: amplify publish (if initialized)"
echo ""
echo "📁 Build output location: dist/"
echo ""
echo -e "${GREEN}✨ Ready for deployment!${NC}"
