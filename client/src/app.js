import React from 'react';

import Home from './components/home';

const DIV = React.DOM.div;
const H3 = React.DOM.h3;

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return DIV({},
            H3({}, 'app.js'),
            'hello world',
            React.cloneElement(this.props.children, { app: this })
        );
    }
}
