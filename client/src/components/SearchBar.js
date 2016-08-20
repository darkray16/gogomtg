import React, { Component } from 'react';

const DIV = React.DOM.div;
const H3 = React.DOM.h3;
const INPUT = React.DOM.input;
const SPAN = React.DOM.span;
const BUTTON = React.DOM.button;

export default class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return DIV({},
            DIV({ className: 'input-group center-block'},
                INPUT({ type: 'text', className: 'form-control', placeholder:'Card Name'}),
                SPAN({ className: 'input-group-btn center-block'},
                    BUTTON({ className: 'btn btn-default', type: 'button'}, 'go!')
                )
            )
        );
    }
}
