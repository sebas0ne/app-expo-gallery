import React, { useState } from "react";
import { 
  Text, 
  View, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Alert,
  Platform
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files'
import image from './assets/perry.png'

const App = () => {

  const [selectedImage, setSelectedImage] = useState(null)
  
  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if(permissionResult.granted === false) {
      alert('Permission to access camera is required');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync()
    
    if(pickerResult.cancelled === true) {
      return;
    }


    if(Platform.OS === 'web'){
      const remoteuri =  await uploadToAnonymousFilesAsync(pickerResult.uri)
      setSelectedImage({localUri: pickerResult.uri, remoteuri})
    }else {
      setSelectedImage({ localUri: pickerResult.uri })
    }

  }

  const openSharedDialog = async () => {
    if (!(await Sharing.isAvailableAsync())){
      alert('Compartir no esta disponible en tu plataforma!');
      return;
    }

    await Sharing.shareAsync(selectedImage.localUri);
  } 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seleccione</Text>
      <Text style={styles.subtitle}>una imagen y compartala!</Text>
      <TouchableOpacity
        onPress={openImagePickerAsync}
      >
      <Image 
        source={{
          uri: 
          selectedImage !== null 
            ? selectedImage.localUri 
            : "https://icons-for-free.com/iconfiles/png/512/gallery-131964752828011266.png"
        }}
        style={styles.image}
      />
      </TouchableOpacity>
        {
          selectedImage ?

          <TouchableOpacity
          style={styles.button}
          onPress={openSharedDialog}
        >
          <Text style={styles.buttonText}>Comparta su imagen!</Text>
        </TouchableOpacity>
        : <View/>
        }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#292929",
  },
  title: { 
    fontSize: 30, 
    color: "#fff",
    backgroundColor: '#a60000',
  },
  subtitle: {
    fontSize: 30, 
    color: "#fff",
    backgroundColor: '#a60000',
  },
  image: {
    height: 200, 
    width: 200, 
    borderRadius: 50,
    resizeMode: 'contain'
  },
  button: { 
    backgroundColor: '#a60000',
    padding: 10,
    marginTop: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
  }
});

export default App;
