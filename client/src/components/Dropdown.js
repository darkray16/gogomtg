import React, { Component } from 'react';

const DIV = React.DOM.div;

var self, home;

export default class Dropdown extends Component{
    constructor(props) {
        super(props);
        self = this;
        home = props.home;
        this.state = {};
    }

    selectCard(name, index) {
        home.setState({ query: name, setsForDropdown: home.state.cardsForDropdown[index].sets, cardsForDropdown: [] });
    }

    render() {
        return DIV({},
            this.props.cards.map((card, index) => {
                return DIV({ value: card.name, className: 'dropDown center-block', key: index, onClick: () => { self.selectCard(card.name, index); } }, card.name);
            })
        );
    }
}
