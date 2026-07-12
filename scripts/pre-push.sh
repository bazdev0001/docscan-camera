#!/bin/bash
set -e
echo "Running pre-push checks..."
echo "1/3 TypeScript check..."
npx tsc --noEmit
echo "2/3 ESLint check..."
npx eslint . --ext .ts,.tsx
echo "3/3 Jest tests..."
npx jest
echo "All checks passed. Pushing..."
