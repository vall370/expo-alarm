import ExpoAlarm from '../index';

describe('ExpoAlarm', () => {
  it('should be defined', () => {
    expect(ExpoAlarm).toBeDefined();
  });

  it('should have expected methods', () => {
    expect(ExpoAlarm.isSupported).toBeDefined();
    expect(ExpoAlarm.requestPermissionsAsync).toBeDefined();
    expect(ExpoAlarm.getPermissionsAsync).toBeDefined();
    expect(ExpoAlarm.scheduleAlarmAsync).toBeDefined();
    expect(ExpoAlarm.cancelAlarmAsync).toBeDefined();
    expect(ExpoAlarm.cancelAllAlarmsAsync).toBeDefined();
    expect(ExpoAlarm.getAllAlarmsAsync).toBeDefined();
    expect(ExpoAlarm.getAlarmAsync).toBeDefined();
    expect(ExpoAlarm.hasAlarmAsync).toBeDefined();
  });

  it('should return boolean for isSupported', () => {
    const result = ExpoAlarm.isSupported();
    expect(typeof result).toBe('boolean');
  });
});