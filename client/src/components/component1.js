import React from 'react';

const DIV = React.DOM.div;
const H3 = React.DOM.h3;

export default class Component1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return DIV({},
            H3({}, 'component1.js'),
            'hi'
        );
    }
}
