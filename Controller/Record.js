import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';




export default function Record() {
    const [message, setMessage] = React.useState("");
    const [recordings, setRecordings] = React.useState([]);
    const [recording, setRecording] = React.useState();

    async function startRecording() {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if(permission.status === 'granted'){
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });
                const { recording } = await Audio.Recording.createAsync(
                    Audio.RecordingOptionsPresets.HIGH_QUALITY
                    );
            }
        }catch(err){
            console.error("Failed audio " + err);
        }
            // console.log('Requesting permissions..');
            // await Audio.requestPermissionsAsync();
            // await Audio.setAudioModeAsync({
            //     allowsRecordingIOS: true,
            //     playsInSilentModeIOS: true,
            // });

        //     console.log('Starting recording..');
        //     const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY
        //     );
        //     setRecording(recording);
        //     console.log('Recording started');
        // } catch (err) {
        //     console.error('Failed to start recording', err);
        // }
    }

    // async function startRecording() {
    //     try {
    //         const permission = await Audio.requestPermissionsAsync();
    //         if (permission.status === "granted") {
    //             await Audio.setAudioModeAsync({
    //                 allowsRecordingIOS: true,
    //                 playsInSilentModeIOS: true,
    //             });
    //             const { recording } = await Audio.Recording.createAsync(
    //                 // Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
    //                 Audio.IOSAudioQuality.HIGH

    //             );

    //             setRecording(recording);
    //         } else {
    //             setMessage("Please grant permission to app to access microphone");
    //         }
    //     } catch (err) {
    //         console.error("Fao;ed to start recording" + err)
    //     }

    // }

  
    async function stopRecording() {
       // console.log('Stopping recording..');
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
         let updateRecordings = [...recordings];
        const { sound, status } = await recording.createNewLoadSoundAsync();
        updateRecordings.push({
            sound: sound,
            duration: getDurationFormatted(status.durationMillis),
            file: recording.getURI()
        });
        setRecordings(updateRecordings);
    
        

        // await Audio.setAudioModeAsync({
        //   allowsRecordingIOS: false,
        // });
        // const uri = recording.getURI();
        // console.log('Recording stopped and stored at', uri);
      }
    // async function stopRecording() {
    //     setRecording(undefined);
    //     await recording.stopAndUnloadAsync();

    //     let updateRecordings = [...recordings];
    //     const { sound, status } = recording.createNewLoadSoundAsync();
    //     updateRecordings.push({
    //         sound: sound,
    //         duration: getDurationFormatted(status.durationMillis),
    //         file: recording.getURI()
    //     })

    //     setRecordings(updateRecordings);
    // }

    function getDurationFormatted(millis) {
        const minutes = millis / 1000 / 60;
        const minutesDisplays = Math.floor(minutes);
        const seconds = Math.round(minutes - minutesDisplays) * 60;
        const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
        return `${minutesDisplays}:${secondsDisplay}`;
    }

    function getRecordingLines() {
        return recordings.map((getRecordingLine, index) => {
            return (
                <View key={index} style={StyleSheet.row}>
                    <Text style={StyleSheet.fill}>Recording {index + 1} - {recording.duration}</Text>
                    <Button style={StyleSheet.button}
                        onPress={() => getRecordingLine.sound.replayAsync()}
                        title='PLAY'></Button>
                </View>
            );
        });



    }

    return (
        <View>
            <Text>{message}</Text>
            <Button
                title={recording ? 'Stop Recording' : 'Start Recording'}
                onPress={recording ? stopRecording : startRecording}
            />
            {getRecordingLines()}
            <StatusBar style='auto' />
        </View>

    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },
    fill: {
        flex: 1,
        margin: 16,
    },
    button: {
        margin: 16
    }
});