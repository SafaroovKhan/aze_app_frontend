import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Platform, ScrollView} from 'react-native';
import React, { useLayoutEffect, useState, useEffect } from 'react'
import { Audio } from 'expo-av';

export default function App() {

  const [text, setText] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [audioFilePath, setAudioFilePath] = useState('');
  const [openCard, setOpenCard] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [sound, setSound] = useState();



  const handleUploadMP3 = async () => {
    try {
        const response = await fetch('http://10.0.2.2:8000/api/generate_audio/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                voice: selectedVoice,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        setSuccessMessage(data.message);
        setAudioFilePath(data.audio_file_url);
        console.log("Audio file URL:", data.audio_file_url); 

    } catch (error) {
        console.error('Error uploading MP3:', error);
    }
};

const handlePlayPause = async () => {
  console.log('Loading Sound');
  const { sound } = await Audio.Sound.createAsync({ audioFilePath });
  console.log( sound )
  setSound( sound );

  console.log('Playing Sound');
  await sound.playAsync();
};

useEffect(() => {
  return sound
    ? async () => {
        console.log('Unloading Sound');
        await sound.unloadAsync();
      }
    : undefined;
}, [sound, audioFilePath]);

const handleCard = (voiceType) => {
  setOpenCard(!openCard)
  setSelectedVoice(voiceType);
}


  return (
    <SafeAreaView style={styles.androidSafeArea}>
      <View style={styles.container}>
        <View style={styles.appHeaderContainer}>
          <Text style={styles.appHeader}>
            Boşluğa istədiyiniz mətni yazın və Səsly mətninizi Azərbaycan dilində səsləndirsin.
          </Text>
        </View>
        <View style={styles.mp3Box}>
          <View style={styles.mp3BoxWrapper}>
            <ScrollView>
            {audioFilePath && (
              <TouchableOpacity style={styles.btn} onPress={handlePlayPause}>
                <Text style={styles.btnTxt}>Play</Text>
              </TouchableOpacity>
            )}
            </ScrollView>
          </View>
        </View>
        <View style={styles.appContentContainer}>
        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.btn} onPress={handleCard}>
            <Text style={styles.btnTxt}> {selectedVoice === 'onyx' ? 'Kişi' : selectedVoice === 'nova' ? 'Qadın' : 'Oxuyucu'}</Text>
          </TouchableOpacity>
          {openCard && (
            <View style={styles.selectBtnWrapper}>
              <TouchableOpacity style={styles.btn} onPress={() => handleCard('onyx')}>
                <Text style={styles.btnTxt}>Kişi</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={() => handleCard('nova')}>
                <Text style={styles.btnTxt}>Qadın</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity style={styles.btn} onPress={handleUploadMP3}>
            <Text style={styles.btnTxt}>Convert</Text>
          </TouchableOpacity>
        </View>
        {successMessage && (
            <View >
                <Text style={styles.successTxt}>Audio successfully converted.</Text>
            </View>
        )}
        <View style={styles.textInputContainer}>
          <TextInput 
            style={styles.textInput} 
            onChangeText={setText} 
            value={text} 
            placeholder="Mətni yazın"
            placeholderTextColor={"#fff"}
          />
        </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  androidSafeArea:{
    flex: 1,
    backgroundColor: '#778DA9',
    paddingTop: Platform.OS === 'android' ? 25 : 0
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 20,
    marginTop: 30
  },
  appHeaderContainer: {
    width: "90%",
    backgroundColor: '#415A77',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#415A77",
    elevation: 2,
  },
  appHeader: {
    fontSize: 24,
    color: "#E0E1DD",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  mp3Box: {
    width: "100%",
    height: 420,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: "center",
  },
  mp3BoxWrapper: {
    width: "90%",
    height: "90%",
  },
  mp3Header: {
    fontSize: 24,
    color: "#E0E1DD"
  },
  appContentContainer: {
    width: "100%",
    height: 180,
    backgroundColor: "#415A77",
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderWidth: 2,
    borderColor: '#1B263B',
    alignItems: "center",
    justifyContent: "center",
    gap: 10
  },
  textInputContainer:{
    width: "90%",
    height: 50,
    marginBottom: 20
  },
  textInput: {
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom:10,
    borderRadius: 15,
    borderColor: "#1B263B",
    borderWidth: 2,
    color: "#E0E1DD",
    backgroundColor: "#1B263B",
    fontSize: 16,
    elevation: 2
  },
  btnContainer:{
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    position: "relative"
  },
  btn: {
    width: 100,
    height: 50,
    paddingTop: 10,
    paddingRight: 5,
    paddingBottom: 10,
    paddingLeft: 5,
    backgroundColor: "#778DA9",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1B263B",
    elevation: 2
  },
  btnTxt: {
    color: "#1B263B",
    fontSize: 16,
    fontWeight: "bold"
  },
  successTxt: {
    fontSize:24,
    color: 'green'
  },
  selectBtnWrapper: {
    width: 120,
    height: 130,
    backgroundColor: "#415A77",
    paddingTop: 10,
    paddingRight: 5,
    paddingBottom: 10,
    paddingLeft: 5,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1B263B",
    elevation: 2,
    position: "absolute",
    top: -135
  },
  selectBtn: {
    width: 80,
    height: 40,
    paddingTop: 10,
    paddingRight: 5,
    paddingBottom: 10,
    paddingLeft: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000"
  },
});