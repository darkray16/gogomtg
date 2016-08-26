import React, { Component } from 'react';
import request from 'superagent';
import Dropdown from './Dropdown';

const DIV = React.DOM.div;
const H3 = React.DOM.h3;
const INPUT = React.DOM.input;
const SPAN = React.DOM.span;
const BUTTON = React.DOM.button;
const DROPDOWN = React.createFactory(Dropdown);

var self, timeout;

export default class Home extends Component {
    constructor(props) {
        super(props);
        self = this;
        this.state = {
            query: '',
            cardsForDropdown: [],
            currentName: '',
            currentSet: ''
        };
    }

    requestCardsForDropdown() {
        window.clearTimeout(timeout);
        timeout = window.setTimeout(() => {
            request
                .post('http://localhost:8200/getCardsInDB')
                .send({
                    query: self.state.query
                })
                .end((err, res) => {
                    if(err){
                        throw err;
                    }
                    self.setState({cardsForDropdown: JSON.parse(res.text)});
                });
        }, 200);
    }

    updateQuery(event) {
        if(event.target.value === '') {
            self.setState({ cardsForDropdown: [], query: '' });
        } else {
            self.setState({ query: event.target.value }, () => {
                self.requestCardsForDropdown();
            });
        }
    }

    priceCheck(event) {
        if(event.keyCode === 13 || event.type === 'click') {
            request
                .post('http://localhost:8200/priceCheck')
                .send({
                    cardName: self.state.currentCard,
                    cardSet: self.state.currentSet
                })
                .end((err, res) => {
                    if(err) {
                        throw err;
                    }
                    var imgUrl = JSON.parse(res.text).imgUrl[0];
                    var price = JSON.parse(res.text).price[0];
                    self.setState({
                        priceOfCard: price || 'Sorry no price data for ' + self.state.currentCard,
                        pictureOfCard: imgUrl || 'Sorry no img data for ' + self.state.currentCard,
                        query: ''
                    });
                });
        }
    }

    renderDropDown() {
        console.log(self.state.cardsForDropdown);
        if(self.state.query === '') {
            return;
        } else {
            return DROPDOWN({cards: self.state.cardsForDropdown});
        }
    }

    //renderSelectBox  value is dependant on optionselectdata

    render() {
        return DIV({},
            H3({ className: 'text-center'}, 'GoGo MTG'),
            DIV({ className: 'input-group center-block marginBottom1' },
                INPUT({ type: 'text',
                className: 'form-control',
                id: 'searchBar',
                placeholder: 'Card Name',
                value: self.state.query,
                onChange: self.updateQuery
                })
            ),
            self.renderDropDown({home: self})
        );
    }
}
