import React, { Component } from 'react';
import './Main.css';


export default class Main extends Component {

  constructor(props) {
    super(props);
    console.log(this.state);
  }

  render() {
    return <h1>Hola Main</h1>
  }
}
