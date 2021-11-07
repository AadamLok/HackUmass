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
  constructor() {
    super();
    this.state = {
        reason: "All catched-up",
        spikes: "",
        num: 0,
        time:"time",
        data: [0,0,0,0,0,0,0,0,0,0]
    };
    //this.navigation = {navigation};
  }

  getNumSpike() {
    fetch("http://127.0.0.1:5000/get/points", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: this.state.username,
      })
    }).then((response) => response.json())
    .then((data) => {
      if(data.num > 0) {
      fetch("http://127.0.0.1:5000/get/graph", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: this.state.username,
          num: data.num
        }).then((response) => response.json())
        .then((json) => {
          if(json.data.length != 0) {
            this.setState({
              reason: json.reason,
              time: json.time,
              spikes: data.spikes,
              num: json.num,
              data: json.data,
            });
          }
        })
      })
    }
    })
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
            <View style={{flex: 0.2}}>
              <Text style={styles.title}>More Details</Text>
            </View>
            <View style={{flex: 1}}>
              <View style = {styles.item}>
                <View>
                <LineChart
                  data={{
                    datasets:[{
                      data: this.state.data
                    }]
                  }}
                  width={Dimensions.get('window').width*7/9} // from react-native
                  height={Dimensions.get('window').height*4/9}
                  chartConfig={{
                    backgroundColor: '#8eb1bf',
                    backgroundGradientFrom: '#8eb1bf',
                    backgroundGradientTo: '#bfedff',
                    //backgroundGradientTo: '#ffa726',
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    }
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16
                  }}
                />
                </View>
                <View style={{flexDirection:'column'}}>
                  <Text style={{fontSize:20, flex:1, textAlign: 'center'}}>{this.state.time}</Text>
                  <Text style={{fontSize:20, flex:1, textAlign: 'center'}}>{this.state.reason}</Text>
                </View>
              </View>
          </View>
              <View style={{flex: 0.1}}>
              <Button 
                onPress={() => {this.getNumSpike();}}
                title="Okay got it, Next"
                color="#8eb1bf"
                style={styles.button}
              />
            </View>
        </View>
      </SafeAreaView>
    );
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
    padding: 10,
    marginLeft: 20,
  },
  item: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
    margin: 2,
    height: height/4,
    fontFamily: 'Montserrat',
    //borderWidth: 3,
 },
});




