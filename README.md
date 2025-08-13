# expo-alarm

Expo Alarm module for Android and iOS with cross-platform alarm scheduling support.

## Features

- ✅ Schedule one-time and repeating alarms
- ✅ Android support with AlarmManager
- ✅ iOS support with UserNotifications (iOS 16+ with AlarmKit structure ready)
- ✅ Web support with browser notifications (fallback)
- ✅ Permission handling
- ✅ Full TypeScript support
- ✅ Event-driven architecture for alarm triggers

## Installation

```bash
npm install expo-alarm
```

## Usage

```typescript
import ExpoAlarm, { AlarmTriggerInput } from 'expo-alarm';

// Check if alarms are supported
const isSupported = ExpoAlarm.isSupported();

// Request permissions
const permissions = await ExpoAlarm.requestPermissionsAsync();

// Schedule an alarm
await ExpoAlarm.scheduleAlarmAsync({
  identifier: 'morning-alarm',
  title: 'Wake Up!',
  body: 'Time to start your day',
  date: new Date(Date.now() + 60000), // 1 minute from now
  repeating: false,
});

// Listen for alarm events
import { useEvent } from 'expo';

const onAlarmTriggered = useEvent(ExpoAlarm, 'alarmTriggered');
const onAlarmDismissed = useEvent(ExpoAlarm, 'alarmDismissed');
```

## API

### Methods

- `isSupported(): boolean` - Check if alarm scheduling is supported
- `requestPermissionsAsync(): Promise<{granted: boolean, canAskAgain: boolean}>` - Request alarm permissions
- `getPermissionsAsync(): Promise<{granted: boolean, canAskAgain: boolean}>` - Get current permission status
- `scheduleAlarmAsync(alarm: AlarmTriggerInput): Promise<void>` - Schedule a new alarm
- `cancelAlarmAsync(identifier: string): Promise<void>` - Cancel a specific alarm
- `cancelAllAlarmsAsync(): Promise<void>` - Cancel all scheduled alarms
- `getAllAlarmsAsync(): Promise<AlarmInfo[]>` - Get all scheduled alarms
- `getAlarmAsync(identifier: string): Promise<AlarmInfo | null>` - Get a specific alarm
- `hasAlarmAsync(identifier: string): Promise<boolean>` - Check if an alarm exists

### Events

- `alarmTriggered` - Fired when an alarm is triggered
- `alarmDismissed` - Fired when an alarm is dismissed

## Platform Support

- **Android**: Uses AlarmManager for reliable alarm scheduling. Requires `SCHEDULE_EXACT_ALARM` permission on Android 12+.
- **iOS**: Uses UserNotifications framework. iOS 16+ structure ready for AlarmKit integration.
- **Web**: Uses browser notifications as fallback with limited capabilities.

## Permissions

### Android
- `android.permission.SCHEDULE_EXACT_ALARM` (Android 12+)
- `android.permission.USE_EXACT_ALARM`
- `android.permission.WAKE_LOCK`
- `android.permission.VIBRATE`

### iOS
- User Notifications permission is automatically requested when needed.

## Example

See the `example/` directory for a complete working example demonstrating all features.
