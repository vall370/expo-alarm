import React, { useState, useEffect } from 'react';
import { useEvent } from 'expo';
import ExpoAlarm, { AlarmInfo, AlarmTriggeredEventPayload, AlarmDismissedEventPayload } from 'expo-alarm';
import { 
  Button, 
  SafeAreaView, 
  ScrollView, 
  Text, 
  View, 
  TextInput, 
  Alert,
  Switch
} from 'react-native';

export default function App() {
  const [alarmTitle, setAlarmTitle] = useState('Wake Up!');
  const [alarmBody, setAlarmBody] = useState('Time to get up');
  const [alarmMinutes, setAlarmMinutes] = useState('1');
  const [isRepeating, setIsRepeating] = useState(false);
  const [alarms, setAlarms] = useState<AlarmInfo[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);

  const onAlarmTriggered = useEvent(ExpoAlarm, 'alarmTriggered');
  const onAlarmDismissed = useEvent(ExpoAlarm, 'alarmDismissed');

  useEffect(() => {
    checkSupport();
    checkPermissions();
    loadAlarms();
  }, []);

  useEffect(() => {
    if (onAlarmTriggered) {
      Alert.alert(
        'Alarm Triggered!',
        `${onAlarmTriggered.title}: ${onAlarmTriggered.body || 'No message'}`,
        [{ text: 'OK' }]
      );
    }
  }, [onAlarmTriggered]);

  useEffect(() => {
    if (onAlarmDismissed) {
      Alert.alert(
        'Alarm Dismissed',
        `Alarm ${onAlarmDismissed.identifier} was dismissed`,
        [{ text: 'OK' }]
      );
      loadAlarms();
    }
  }, [onAlarmDismissed]);

  const checkSupport = async () => {
    try {
      const supported = ExpoAlarm.isSupported();
      setIsSupported(supported);
    } catch (error) {
      console.log('Error checking support:', error);
    }
  };

  const checkPermissions = async () => {
    try {
      const permissions = await ExpoAlarm.getPermissionsAsync();
      setHasPermissions(permissions.granted);
    } catch (error) {
      console.log('Error checking permissions:', error);
    }
  };

  const requestPermissions = async () => {
    try {
      const permissions = await ExpoAlarm.requestPermissionsAsync();
      setHasPermissions(permissions.granted);
      if (!permissions.granted) {
        Alert.alert('Permissions Required', 'Please grant notification permissions to use alarms.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to request permissions');
    }
  };

  const loadAlarms = async () => {
    try {
      const allAlarms = await ExpoAlarm.getAllAlarmsAsync();
      setAlarms(allAlarms);
    } catch (error) {
      console.log('Error loading alarms:', error);
    }
  };

  const scheduleAlarm = async () => {
    if (!hasPermissions) {
      await requestPermissions();
      return;
    }

    try {
      const minutes = parseInt(alarmMinutes) || 1;
      const futureDate = new Date();
      futureDate.setMinutes(futureDate.getMinutes() + minutes);

      await ExpoAlarm.scheduleAlarmAsync({
        identifier: `alarm_${Date.now()}`,
        title: alarmTitle,
        body: alarmBody,
        date: futureDate,
        repeating: isRepeating,
        repeatInterval: isRepeating ? minutes * 60 * 1000 : undefined,
      });

      Alert.alert('Success', `Alarm scheduled for ${minutes} minutes from now`);
      loadAlarms();
    } catch (error) {
      Alert.alert('Error', `Failed to schedule alarm: ${error}`);
    }
  };

  const cancelAlarm = async (identifier: string) => {
    try {
      await ExpoAlarm.cancelAlarmAsync(identifier);
      Alert.alert('Success', 'Alarm cancelled');
      loadAlarms();
    } catch (error) {
      Alert.alert('Error', `Failed to cancel alarm: ${error}`);
    }
  };

  const cancelAllAlarms = async () => {
    try {
      await ExpoAlarm.cancelAllAlarmsAsync();
      Alert.alert('Success', 'All alarms cancelled');
      loadAlarms();
    } catch (error) {
      Alert.alert('Error', `Failed to cancel all alarms: ${error}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Expo Alarm Example</Text>
        
        <Group name="Status">
          <Text>Supported: {isSupported ? '✅' : '❌'}</Text>
          <Text>Permissions: {hasPermissions ? '✅' : '❌'}</Text>
          {!hasPermissions && (
            <Button title="Request Permissions" onPress={requestPermissions} />
          )}
        </Group>

        <Group name="Schedule Alarm">
          <Text>Title:</Text>
          <TextInput
            style={styles.input}
            value={alarmTitle}
            onChangeText={setAlarmTitle}
            placeholder="Alarm title"
          />
          
          <Text>Message:</Text>
          <TextInput
            style={styles.input}
            value={alarmBody}
            onChangeText={setAlarmBody}
            placeholder="Alarm message"
          />
          
          <Text>Minutes from now:</Text>
          <TextInput
            style={styles.input}
            value={alarmMinutes}
            onChangeText={setAlarmMinutes}
            placeholder="1"
            keyboardType="numeric"
          />

          <View style={styles.switchContainer}>
            <Text>Repeating:</Text>
            <Switch value={isRepeating} onValueChange={setIsRepeating} />
          </View>

          <Button title="Schedule Alarm" onPress={scheduleAlarm} />
        </Group>

        <Group name={`Active Alarms (${alarms.length})`}>
          {alarms.length === 0 ? (
            <Text>No active alarms</Text>
          ) : (
            alarms.map((alarm, index) => (
              <View key={alarm.identifier} style={styles.alarmItem}>
                <Text style={styles.alarmTitle}>{alarm.title}</Text>
                <Text>{alarm.body}</Text>
                <Text>Date: {new Date(alarm.date).toLocaleString()}</Text>
                <Text>Repeating: {alarm.repeating ? 'Yes' : 'No'}</Text>
                <Button 
                  title="Cancel" 
                  onPress={() => cancelAlarm(alarm.identifier)}
                  color="red"
                />
              </View>
            ))
          )}
          
          {alarms.length > 0 && (
            <Button title="Cancel All Alarms" onPress={cancelAllAlarms} color="red" />
          )}
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
    textAlign: 'center' as const,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold' as const,
  },
  group: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
  },
  switchContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginVertical: 10,
  },
  alarmItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  alarmTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    marginBottom: 5,
  },
};
