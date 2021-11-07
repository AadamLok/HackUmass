import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { useState } from 'react';
import { render } from 'react-dom';
import { ScrollView, ImageBackground, Button, TextInput, Image, StyleSheet, Text, View, SafeAreaView, Dimensions} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import {LineChart} from 'react-native-chart-kit'
 
let { width, height } = Dimensions.get('screen');
width += 100;

// let customFonts = {
//   Montserrat: require('../assets/fonts/Montserrat-Regular.ttf')
// };

// class Greeting extends Component {
//   render() {
//     return <h1>{this.props.statement} I am feeling {this.props.expression} today!</h1>;
//   }
// }
// const score = 'Happy';
// <Greeting score='Hello' score={score}/> // statement and expression are the props (ie. arguments) we are passing to Greeting component



class Details extends Component {
  state = {
    info: [
       {'time': '1', 'reason': "Breaked Too Fast!"},
       {'time': '50', 'reason': "Sudden Acceleration!"},
       {'time': '56', 'reason': "Breaked Too Fast!"},
       {'time': '50', 'reason': "Sudden Acceleration!"},
       {'time': '66', 'reason': "Breaked Too Fast!"},
       {'time': '76', 'reason': "Breaked Too Fast!"},
       {'time': '86', 'reason': "Breaked Too Fast!"},
       {'time': '96', 'reason': "Breaked Too Fast!"},
       {'time': '106', 'reason': "Breaked Too Fast!"},
       {'time': '116', 'reason': "Breaked Too Fast!"},
       {'time': '126', 'reason': "Breaked Too Fast!"},


    ]
 }

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
        <View style={{flex: 0.9}}>
            <View style={{flex: 0.1}}>
              <Text style={styles.title}>More Details</Text>
            </View>
            <View style={{flex: 0.6, paddingTop:40, }}>
          
              <ScrollView style={{height:height-200, width: width*2/3}}  >
                {/* //style={{height:height-300, width: width*2/3}} */}
                {
                    this.state.info.map((item, index) => (
                      <View key = {item.time} style = {styles.item, {height:height/4, width: width*2/3}}>
                        <View style={{flex: 0.13}}>
                          <Text style={{fontSize:20, fontFamily: 'Montserrat',}}>{item.time}:00: {item.reason}</Text>
                        </View>
                        <View style={{flex: 0.1}}>
                          <LineChart style={{flex: 0.1}}
                            data={{
                              labels: ['0', '1', '2', '3', '4', '5'],
                              datasets: [{
                                data: [
                                  Math.random() * 100,
                                  Math.random() * 100,
                                  Math.random() * 100,
                                  Math.random() * 100,
                                  Math.random() * 100,
                                  Math.random() * 100
                                ]
                              }]
                            }}
                            width={Dimensions.get('window').width*2/3} // from react-native
                            height={100}
                            chartConfig={{
                              backgroundColor: '#8eb1bf',
                              backgroundGradientFrom: '#8eb1bf',
                              backgroundGradientTo: '#bfedff',
                              //backgroundGradientTo: '#ffa726',
                              decimalPlaces: 2, // optional, defaults to 2dp
                              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                              style: {
                                borderRadius: 16
                              }
                            }}
                            bezier
                            style={{
                              marginVertical: 8,
                              borderRadius: 16
                            }}
                          />
                        </View>
                        
                      </View>
                    ))
                }
              </ScrollView>
          </View>
              <View style={{flex: 0.2}}>
              <Button 
                onPress={() => {this.props.navigation.navigate("Home");}}
                title="Back"
                color="#8eb1bf"
                accessibilityLabel="Click this button to go to the registration page"
              />
            </View>
        </View>
      </SafeAreaView>
    );
  }
} 

class NavDetails extends Component {
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

export default Details;

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
    paddingTop:15,
    fontFamily: 'Montserrat',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  item: {
    //flexDirection: 'row',

    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
    margin: 2,
    height: height/4,
    fontFamily: 'Montserrat',
    //borderWidth: 3,
    backgroundColor: 'rgba(.6, .4, .2, 0.4)',
 }
});




