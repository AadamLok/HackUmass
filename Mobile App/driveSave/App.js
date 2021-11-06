import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, StyleSheet, Text, View, SafeAreaView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.banner}
        blurRadius = {7}
        source = {{
          top: 10,
          width: 400,
          height: 200,
          uri: "https://cdn.pixabay.com/photo/2013/11/28/10/36/road-220058_1280.jpg",
        }}
      />
      <Text style={styles.title}>Welcome to DriveSave!</Text>
      <Text>Drive smart, drive safe, save lives. lmao</Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  banner: {
    flex: 0.2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
