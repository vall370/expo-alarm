# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo module called `expo-alarm` that provides cross-platform alarm scheduling functionality for Android, iOS, and Web. The module uses AlarmManager on Android, UserNotifications on iOS (with AlarmKit structure ready for iOS 16+), and browser notifications on web as a fallback.

## Development Commands

- `npm run build` - Build the module using expo-module build
- `npm run clean` - Clean build artifacts
- `npm run lint` - Run linting on the codebase
- `npm run test` - Run tests
- `npm run prepare` - Prepare the module for development
- `npm run prepublishOnly` - Prepare for publishing
- `npm run open:ios` - Open iOS example project in Xcode
- `npm run open:android` - Open Android example project in Android Studio

## Architecture

### Module Structure
- **JavaScript Layer** (`src/`):
  - `ExpoAlarmModule.ts` - Native module interface and type definitions
  - `ExpoAlarmView.tsx` - React Native view component
  - `ExpoAlarm.types.ts` - TypeScript type definitions
  - `index.ts` - Main export file
  - `.web.ts` files - Web platform implementations

- **Android Layer** (`android/src/main/java/expo/modules/alarm/`):
  - `ExpoAlarmModule.kt` - Android native module implementation
  - `ExpoAlarmView.kt` - Android native view implementation

- **iOS Layer** (`ios/`):
  - `ExpoAlarmModule.swift` - iOS native module implementation
  - `ExpoAlarmView.swift` - iOS native view implementation

### Module Configuration
- `expo-module.config.json` defines platform-specific module mappings
- Supports Apple, Android, and Web platforms
- Native module names: `ExpoAlarmModule` (iOS), `expo.modules.alarm.ExpoAlarmModule` (Android)

### Example App
The `example/` directory contains a complete React Native app demonstrating:
- Permission checking and requesting
- Scheduling one-time and repeating alarms
- Viewing and managing active alarms
- Event handling for alarm triggers and dismissals
- Cross-platform alarm functionality

## Development Notes

- Uses `expo-module-scripts` for build tooling
- TypeScript configuration in `tsconfig.json`
- **Android Implementation**: Uses AlarmManager with AlarmReceiver for background alarms
- **iOS Implementation**: Uses UserNotifications framework with AlarmKit structure ready for iOS 16+
- **Web Implementation**: Uses browser notifications as fallback with limited capabilities
- Platform-specific code automatically resolved by Expo module system
- Proper permission handling for each platform
- Event-driven architecture for alarm lifecycle management

## Key Features
- Cross-platform alarm scheduling (Android, iOS, Web)
- Permission management
- Repeating and one-time alarms
- Alarm persistence and management
- Event notifications for alarm triggers