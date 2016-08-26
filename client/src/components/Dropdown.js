import React, { Component } from 'react';

const DIV = React.DOM.div;

var home;

export default class Dropdown extends Component{
    constructor(props) {
        super(props);
        home = props.home;
        this.state = {};
    }
    //onclick set home state optionselectdata = cardsForDropdown[index]
    render() {
        return DIV({},
            this.props.cards.map((card, index) => {
                return DIV({ className: 'dropDown center-block', key: index }, card.name);
            })
        );
    }
}
