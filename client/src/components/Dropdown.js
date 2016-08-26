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

    //onclick set home state optionselectdata = cardsForDropdown[index]
    selectCard(event, index) {
        console.log('hi');
        home.setState({ query: event.target.value, setsForDropdown: home.state.cardsForDropdown[index].sets, cardsForDropdown: [] });
    }

    render() {
        return DIV({},
            this.props.cards.map((card, index) => {
                return DIV({ value: card.name, className: 'dropDown center-block', key: index, onClick: (e) => { self.selectCard(e, index); } }, card.name);
            })
        );
    }
}
