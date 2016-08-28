import React, { Component } from 'react';

import Home from './components/home';

const DIV = React.DOM.div;
const H3 = React.DOM.h3;

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return DIV({ id: 'wrap' },
            React.cloneElement(this.props.children, { app: this })
        );
    }
}
