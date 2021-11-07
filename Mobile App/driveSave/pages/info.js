import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { useState } from 'react';
import { render } from 'react-dom';
import { ImageBackground, Button, TextInput, Image, StyleSheet, Text, View, SafeAreaView, Dimensions} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

// class Score extends Component(score) {
//   constructor(score) {
//     super();
//     this.score = score;
//   }
//   render() {
//     return (
//     <View style={{flex: 0.3}}>
//       <Text style={styles.title}>Your Score:</Text>
//       <View style={{flex: 0.3}}>
//         <Text style={styles.title}>{this.score}</Text>
//       </View>
//     </View>
//     );
//   }
// }
let { width, height } = Dimensions.get('screen');
width += 100;

let customFonts = {
  Montserrat: require('../assets/fonts/Montserrat-Regular.ttf')
};

// class Greeting extends Component {
//   render() {
//     return <h1>{this.props.statement} I am feeling {this.props.expression} today!</h1>;
//   }
// }
// const score = 'Happy';
// <Greeting score='Hello' score={score}/> // statement and expression are the props (ie. arguments) we are passing to Greeting component


class Info extends Component {
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
         {/* <Image style={styles.banner}
          source = {
            require("assets/icon.png/")
            // width: 200,
            // height: 200,
            // uri: "https://i.ibb.co/grnKX93/icon.png",
          }
        /> */}
        <View style={{flex: 0.3}}>
            <View style={{flex: 0.3}}>
              <Text style={styles.title}>Your Score:</Text>
              <View style={{flex: 1}}>
                <Text style={{fontSize: 100, zIndex:10}}>7</Text>
            </View>
            </View>
            {/* <Text style={styles.title}>Welcome to DriveSave!</Text>
            <Text>Drive smart, drive safe, save lives. lmao</Text> */}
            <StatusBar style="auto" />
            <View style={{flex: 0.2}}>
              <Button 
                onPress={() => {this.props.navigation.navigate("Home");}}
                title="More Info"
                color="#8eb1bf"
                accessibilityLabel="Click this button to go to the registration page"
              />
            </View>
        </View>
      </SafeAreaView>
    );
  }
} 

class Navinfo extends Component {
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
        <Stack.Navigator>
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

export default Info;

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




