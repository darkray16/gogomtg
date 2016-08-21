import React, { Component } from 'react';

const DIV = React.DOM.div;

export default class Dropdown extends Component{
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return DIV({},
            this.props.cards.map((card, index) => {
                return DIV({ className: 'dropDown center-block', key: index }, card.name + ' ' + card.set);
            })
        );
    }
}
