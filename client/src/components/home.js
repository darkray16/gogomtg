import React, { Component } from 'react';
import SearchBar from './SearchBar';

const SEARCHBAR = React.createFactory(SearchBar);
const DIV = React.DOM.div;
const H3 = React.DOM.h3;

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return DIV({},
            H3({ className: 'text-center'}, 'GoGo MTG'),
            SEARCHBAR({}),
                DIV({}, 'dropdown')
        );
    }
}
