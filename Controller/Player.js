import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, TextInput } from 'react-native';
import { Audio } from 'expo-av';
import PushNotification from 'react-native-push-notification';

export default function Player() {
  const [recording, setRecording] = useState(null);
  const [alarmTime, setAlarmTime] = useState('');

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HighQuality
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(null);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);

    // Schedule a local notification with the recorded audio as the sound
    PushNotification.localNotification({
      title: 'Alarm',
      message: 'Wake up!',
      soundName: uri,
      playSound: true,
      date: new Date(alarmTime),
    });
  }

  return (
    <View style={styles.container}>
      {/* <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      {recording && (
        <View style={styles.alarmContainer}>
          <Text style={styles.label}>Set alarm time:</Text>
          <TextInput
            style={styles.input}
            value={alarmTime}
            placeholder="Enter alarm time"
            onChangeText={setAlarmTime}
          />
        </View>
      )} */}
      <Text>hello</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alarmContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});
