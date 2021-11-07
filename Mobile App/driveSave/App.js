import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { useState } from 'react';
import { render } from 'react-dom';
import { Button, TextInput, Image, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import Login from './pages/login';
import Register from './pages/register';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// class Username extends Component {
//   constructor() {
//     super();
//     this.state = {user: ""};
//   }
//   render() {
//     return (
//       <View style={{padding: 5}}>
//         <TextInput
//           style={{height: 40}}
//           placeholder="Email"
//           onChangeText={text => {
//             this.props.userCallback(text);
//             this.setState({user: text});
//           }}
//           defaultValue={this.state.user}
//         />
//         {/* <Text style={{padding: 10, fontSize: 42}}>
//           {text.split(' ').map((word) => word && '').join(' ')}
//         </Text> */}
//       </View>
//     );
//   }
// }

class Home extends Component {
  constructor() {
    super();
    //this.navigation = {navigation};
  }
  render() {
    return (
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
        {//<Password></Password>
        }
        <Button
          onPress={() => {this.props.navigation.navigate("Login");}}
          title="Log In"
          color="#8eb1bf"
          accessibilityLabel="Click this button to go to the login page"
        />
        <Button
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
      </SafeAreaView>
    );
  }
} 

class App extends Component {
  // constructor() {
  //   super();
  //   this.state = { print: "Waiting.", username: "", password: ""};
  //   this.username = (user) => {
  //     this.setState({username: user});
  //   }
  //   this.password = (pass) => {
  //     this.setState({password: pass});
  //   }
  // }

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


  render() {
    const Stack = createNativeStackNavigator();
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      </NavigationContainer>
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
