import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { useState } from 'react';
import { render } from 'react-dom';
import { ImageBackground, Button, TextInput, Image, StyleSheet, Text, View, SafeAreaView, Dimensions} from 'react-native';
import Login from './pages/login';
import Register from './pages/register';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

// class SubmitButtons extends Component {
//   constructor() {
//     super();
//     this.state = {user: ""};
//   }
//   render() {
//     return (class Title extends Component {
//   state = {
//     fontsLoaded: false,
//   };


//   render() {
//       <View style={{padding: 5}}>
        
//       </View>
//     );
//   }
// }
let { width, height } = Dimensions.get('screen');
width += 100;

let customFonts = {
  Montserrat: require('./assets/fonts/Montserrat-Regular.ttf')
};

class Home extends Component {
  constructor() {
    super();
    //this.navigation = {navigation};
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
        <View style={{flex: 0.5}}>

        {/* <Image style={styles.banner}
          blurRadius = {7}
          source = {{
            width: 400,
            height: 200,
            uri: "https://cdn.pixabay.com/photo/2013/11/28/10/36/road-220058_1280.jpg",
          }}
        /> */}
        <Text style={styles.title}>DriveSave</Text>
        {/* <Text style={styles.title}>Welcome to DriveSave!</Text>
        <Text>Drive smart, drive safe, save lives. lmao</Text> */}
         <StatusBar style="auto" />
        {//<Password></Password>
        }
        <Button style={styles.submitBut}
          onPress={() => {this.props.navigation.navigate("Login");}}
          title="Log In"
          color="#8eb1bf"
          accessibilityLabel="Click this button to go to the login page"
        />
        <Button style={styles.submitBut}
          onPress={() => {this.props.navigation.navigate("Register");}}
          title="Register"
          color="#8eb1bf"
          accessibilityLabel="Click this button to go to the registration page"
        />
        {/* <Text>Home Screen</Text>
        <Button
          title="Go to Details"
          onPress={() => navigation.navigate('Details')}
        /> */}
        </View>
      </SafeAreaView>
    );
  }
} 

class App extends Component {
  constructor() {
    super();
    this.state = {fontsLoaded: false};
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

  async _loadFontsAsync() {
    console.log("Here!!")
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
  }

    //const [text, setText] = useState('');


  render() {
    const Stack = createNativeStackNavigator();
    if (this.state.fontsLoaded) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" 
                  screenOptions={{
                    headerShown: false
                  }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      </NavigationContainer>
    );
    } else {
      return <AppLoading />;
    }
  }
}

export default App;

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
  // submitBut: {
  //   marginVertical:1000
  // }
});




