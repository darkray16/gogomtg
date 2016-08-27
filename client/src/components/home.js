import React, { Component } from 'react';
import request from 'superagent';
import Dropdown from './Dropdown';

const DIV = React.DOM.div;
const H3 = React.DOM.h3;
const SELECT = React.DOM.select;
const OPTION = React.DOM.option;
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
            setsForDropdown: [],
            currentSet: ''
        };
    }

    priceCheck() {
        request
        .post('http://localhost:8200/priceCheck')
        .send({
            name: self.state.query,
            set: self.state.currentSet
        })
        .end((err, res) => {
            if(err) {
                throw err;
            }
            var imgUrl = JSON.parse(res.text).imgUrl[0];
            var price = JSON.parse(res.text).price[0];
            console.log('imgUrl: ', imgUrl);
            // self.setState({
            //     priceOfCard: price || 'Sorry no price data for ' + self.state.currentCard,
            //     pictureOfCard: imgUrl || 'Sorry no img data for ' + self.state.currentCard,
            //     query: '',
            //     setsForDropdown: []
            // });
        });
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
                    self.setState({ cardsForDropdown: JSON.parse(res.text) });
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

    updateCurrentSet(event) {
        self.setState({ currentSet: event.target.value }, () => {
            console.log(self.state);
        });
    }


    renderCardsForDropdown() {
        if(self.state.query === '') {
            return;
        } else {
            return DROPDOWN({ home: self, cards: self.state.cardsForDropdown });
        }
    }

    renderSetsForDropdown() {
        var data = self.state.setsForDropdown;
        var storage = [];

        for(var i = 0; i < data.length; i++) {
            if(!data[i]) {
                storage.push(data[i]);
            }
        }
        return SELECT({ className: 'form-control', onChange: (e) => { self.updateCurrentSet(e); }},
            OPTION({ value: '' }, self.state.query.length? 'What Set is it From?': ''),
            data.map((set, index) => {
                return OPTION({key: index, value: set}, set);
            })
        );
    }

    renderQueryButton() {
        return BUTTON({ type: 'submit', className: 'btn btn-default', onClick: self.priceCheck }, 'GO');
    }

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
            self.renderCardsForDropdown(),
            self.renderSetsForDropdown(),
            self.renderQueryButton()
        );
    }
}
