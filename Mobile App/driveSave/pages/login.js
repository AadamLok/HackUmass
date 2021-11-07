import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { useState } from 'react';
import { render } from 'react-dom';
import { ScrollView, ImageBackground, Button, TextInput, Image, StyleSheet, Text, View, SafeAreaView, Dimensions} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

let { width, height } = Dimensions.get('screen');
width += 100;

let customFonts = {
  Montserrat: require('../assets/fonts/Montserrat-Regular.ttf')
};

class Username extends Component {
  constructor() {
    super();
    this.state = {user: ""};
  }
  render() {
    return (
      <View style={{padding: 5}}>
        <TextInput
          style={{height: 40}}
          placeholder="Email"
          onChangeText={text => {
            this.props.userCallback(text);
            this.setState({user: text});
          }}
          defaultValue={this.state.user}
        />
        {/* <Text style={{padding: 10, fontSize: 42}}>
          {text.split(' ').map((word) => word && '').join(' ')}
        </Text> */}
      </View>
    );
  }
}

class Password extends Component {
  constructor() {
    super();
    this.state = {pass: ""};
  }
  render() {
    return (
      <View style={{padding: 5}}>
        <TextInput
          style={{height: 40}}
          placeholder="Password"
          onChangeText={text => {
            this.props.passCallback(text);
            this.setState({pass: text});
          }}
          defaultValue={this.state.password}
        />
        {/* <Text style={{padding: 10, fontSize: 42}}>
          {text.split(' ').map((word) => word && '').join(' ')}
        </Text> */}
      </View>
    );
  }
} 

class Login extends Component {
  constructor() {
    super();
    this.state = { print: "Waiting.", username: "", password: ""};
    this.username = (user) => {
      this.setState({username: user});
    }
    this.password = (pass) => {
      this.setState({password: pass});
    }
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

  render() {
    // const [loaded] = useFonts({
    //   Montserrat: require('./assets/fonts/Montserrat-Regular.ttf'),
    // });
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          style = {{ 
            position: 'absolute',
            flex: 1, 
            height: height, width,
            zIndex: 0 }}
          blurRadius = {5}
          source = {{
            width: 400,
            height: 200,
            //uri: "https://publicdomainpictures.net/pictures/110000/nahled/asphalt-road-into-distance.jpg",
            uri: "https://cdn.pixabay.com/photo/2013/11/28/10/36/road-220058_1280.jpg",
          }
        }
        />
         {/* <Image style={styles.banner}
          source = {
            require("assets/icon.png/")
            // width: 200,
            // height: 200,
            // uri: "https://i.ibb.co/grnKX93/icon.png",
          }
        /> */}
        <Text style={styles.title}>Welcome to DriveSave!</Text>
        <Text>Drive smart, drive safe, save lives. lmao</Text>
        <StatusBar style="auto" />
        <Username userCallback={this.username}></Username>
        <Password passCallback={this.password}></Password>
        {//<Password></Password>
        }
        <Button
          onPress={() => {console.log(this.state.username); console.log(this.state.password);}}
          title="Submit"
          color="#8eb1bf"
          //"#8eb1bf", "#a2cbdb", "#7eb2c3", "#50a3df"
          accessibilityLabel="Click this button to log in"
        />
        <Button
          onPress={() => {this.props.navigation.navigate("Home");}}
          title="Back"
          color="#8eb1bf"
          accessibilityLabel="Leave login"
        />
      </SafeAreaView>
    );
  }
} 


export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    //justifyContent: 'space-around'
  },
  title: {
    fontSize: 30,
    fontFamily: 'Montserrat',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  // Text: {
  //   fontFamily: 'montserrat-regular',
  // },
  banner: {
    flex: 0.2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBut: {
    flex: 0.4,
  }
});




