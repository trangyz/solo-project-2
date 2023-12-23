import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Inputs extends Component {
    constructor(props) {
        this.state = {

        }
    }

    componentDidMount() {
        fetch('/feed')
    }
}
export default Inputs;
