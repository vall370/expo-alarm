import { registerWebModule, NativeModule } from 'expo';

import { ExpoAlarmModuleEvents, AlarmTriggerInput, AlarmInfo } from './ExpoAlarm.types';

class ExpoAlarmModule extends NativeModule<ExpoAlarmModuleEvents> {
  private alarms: Map<string, AlarmInfo> = new Map();
  private timeouts: Map<string, ReturnType<typeof setTimeout>> = new Map();

  isSupported(): boolean {
    // Web platform has limited alarm capabilities
    return false;
  }

  async requestPermissionsAsync(): Promise<{ granted: boolean; canAskAgain: boolean }> {
    // Web doesn't require permissions for notifications
    return { granted: true, canAskAgain: false };
  }

  async getPermissionsAsync(): Promise<{ granted: boolean; canAskAgain: boolean }> {
    return { granted: true, canAskAgain: false };
  }

  async scheduleAlarmAsync(alarm: AlarmTriggerInput): Promise<void> {
    if (!('Notification' in window)) {
      throw new Error('Notifications are not supported in this browser');
    }

    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission not granted');
      }
    }

    // Cancel existing alarm with same identifier
    await this.cancelAlarmAsync(alarm.identifier);

    const alarmInfo: AlarmInfo = {
      identifier: alarm.identifier,
      title: alarm.title,
      body: alarm.body,
      date: alarm.date,
      repeating: alarm.repeating || false,
      repeatInterval: alarm.repeatInterval,
      sound: alarm.sound,
      enabled: true,
    };

    this.alarms.set(alarm.identifier, alarmInfo);

    const now = new Date().getTime();
    const triggerTime = alarm.date.getTime();
    const delay = triggerTime - now;

    if (delay > 0) {
      const timeout = setTimeout(() => {
        this.triggerAlarm(alarmInfo);
      }, delay);
      
      this.timeouts.set(alarm.identifier, timeout);
    } else {
      throw new Error('Alarm time must be in the future');
    }
  }

  private triggerAlarm(alarm: AlarmInfo): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(alarm.title, {
        body: alarm.body,
        icon: '/favicon.ico',
      });
    }

    this.emit('alarmTriggered', {
      identifier: alarm.identifier,
      title: alarm.title,
      body: alarm.body,
      date: alarm.date,
    });

    // Handle repeating alarms
    if (alarm.repeating && alarm.repeatInterval) {
      const nextDate = new Date(alarm.date.getTime() + alarm.repeatInterval);
      const updatedAlarm = { ...alarm, date: nextDate };
      this.alarms.set(alarm.identifier, updatedAlarm);
      
      const timeout = setTimeout(() => {
        this.triggerAlarm(updatedAlarm);
      }, alarm.repeatInterval);
      
      this.timeouts.set(alarm.identifier, timeout);
    } else {
      this.alarms.delete(alarm.identifier);
      this.timeouts.delete(alarm.identifier);
    }
  }

  async cancelAlarmAsync(identifier: string): Promise<void> {
    const timeout = this.timeouts.get(identifier);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(identifier);
    }
    this.alarms.delete(identifier);
  }

  async cancelAllAlarmsAsync(): Promise<void> {
    for (const timeout of this.timeouts.values()) {
      clearTimeout(timeout);
    }
    this.timeouts.clear();
    this.alarms.clear();
  }

  async getAllAlarmsAsync(): Promise<AlarmInfo[]> {
    return Array.from(this.alarms.values());
  }

  async getAlarmAsync(identifier: string): Promise<AlarmInfo | null> {
    return this.alarms.get(identifier) || null;
  }

  async hasAlarmAsync(identifier: string): Promise<boolean> {
    return this.alarms.has(identifier);
  }
}

export default registerWebModule(ExpoAlarmModule, 'ExpoAlarmModule');
