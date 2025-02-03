#!/bin/bash

# Set environment variables
export NODE_ENV=production

# Bundle JavaScript code
echo "Bundling JavaScript code........................................................................."
npx react-native bundle --platform android --dev false --entry-file ./src/app/_layout.tsx --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

# Change the current directory to the android directory of the project.
echo "Changing directory to android........................................................................."
cd android

# The following commands use Gradle, a build tool for Android, to build the APK.
# ./gradlew clean
# ./gradlew --stop
# assembleRelease: Builds the release APK.
echo "Building release APK........................................................................."
./gradlew assembleRelease 

echo "Installing release APK........................................................................."
./gradlew installRelease

# assembleRelease: Bundles the release AAB.
# echo "Bundling release AAB........................................................................."
# ./gradlew bundleRelease 

echo "All tasks completed successfully........................................................................."