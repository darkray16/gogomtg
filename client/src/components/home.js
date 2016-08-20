import React from 'react';

const DIV = React.DOM.div;
const H3 = React.DOM.h3;

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return DIV({},
            H3({}, 'home.js'),
            'hi'
        );
    }
}
