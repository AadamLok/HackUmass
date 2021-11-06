import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { useState } from 'react';
import { render } from 'react-dom';
import { Button, TextInput, Image, StyleSheet, Text, View, SafeAreaView } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

class Username extends Component {
  render() {
    return (
      <View style={{padding: 5}}>
        <TextInput
          style={{height: 40}}
          placeholder="Email"
          onChangeText={text => setText(text)}
          defaultValue={text}
        />
        {/* <Text style={{padding: 10, fontSize: 42}}>
          {text.split(' ').map((word) => word && '').join(' ')}
        </Text> */}
      </View>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = { print: "Waiting.", username: ""};
  }

  getMessage() {
    return fetch('http://10.0.2.2:5000/')
      .then((response) => response.json())
      .then((json) => {
        return json.status;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  async componentDidMount() {
    let val = await this.getMessage();
    this.setState({ print: val});
  }

    //const [text, setText] = useState('');

  Password() {
    const [text, setText] = useState('');
    return (
      <View style={{padding: 0}}>
        <TextInput
          style={{height: 40}}
          placeholder="Password"
          onChangeText={text => setText(text)}
          defaultValue={text}
        />
        {/* <Text style={{padding: 10, fontSize: 42}}>
          {text.split(' ').map((word) => word && '').join(' ')}
        </Text> */}
      </View>
    );
  }

  render() {
    return (
      // <View style={styles.container}>
      //   <Text>{this.state.print}</Text>
      //   <StatusBar style="auto" />
      // </View>
      <SafeAreaView style={styles.container}>
        <Image style={styles.banner}
          blurRadius = {7}
          source = {{
            width: 400,
            height: 200,
            uri: "https://cdn.pixabay.com/photo/2013/11/28/10/36/road-220058_1280.jpg",
          }}
        />
        <Text style={styles.title}>Welcome to DriveSave!</Text>
        <Text>Drive smart, drive safe, save lives. lmao</Text>
        <StatusBar style="auto" />
        <Username></Username>
        <Password></Password>
        <Button
          onPress={() => console.log("something")}
          title="Submit"
          color="#e0fa91"
          accessibilityLabel="Click this button to log in"
        />
      </SafeAreaView>
    );
  }
}

export default App;

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
