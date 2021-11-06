import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { StyleSheet, Text, View } from 'react-native';

class App extends Component {
  constructor() {
    super();
    this.state = { print: "Waiting."}
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
    return (
      <View style={styles.container}>
        <Text>{this.state.print}</Text>
        <StatusBar style="auto" />
      </View>
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
