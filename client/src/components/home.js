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
const IMAGE = React.DOM.img;
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
            currentSet: '',
            priceOfCard: '',
            pictureOfCard: '',
            traderOneTotal: 0,
            traderTwoTotal: 0
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
            self.setState({
                priceOfCard: price || 'Sorry no price data for ' + self.state.currentCard,
                pictureOfCard: imgUrl || 'Sorry no img data for ' + self.state.currentCard,
                query: '',
                setsForDropdown: []
            });
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
        return SELECT({ className: 'form-control', id: 'setBox', onChange: (e) => { self.updateCurrentSet(e); }},
            OPTION({ value: '' }, self.state.query.length? 'Choose a set!': ''),
            data.map((set, index) => {
                return OPTION({key: index, value: set}, set);
            })
        );
    }

    renderQueryButton() {
        return BUTTON({ type: 'submit', className: 'btn btn-default', id: 'submit', onClick: self.priceCheck }, 'GO');
    }

    renderCardInfo() {
        return DIV({},
            IMAGE({ className: 'center-block', src: self.state.pictureOfCard, id: 'pictureOfCard' }),
            DIV({ className: 'text-center', id: 'priceOfCard' }, self.state.priceOfCard)
        );
    }

    renderQueryBox() {
        return DIV({ className: 'input-group marginBottom1' },
                    INPUT({ type: 'text',
                        className: 'form-control',
                        id: 'queryBox',
                        placeholder: 'Enter card name',
                        value: self.state.query,
                        onChange: self.updateQuery
                    })
                );
    }

    renderTraderButtons() {
        return DIV({ className: 'center-block'},
        DIV({className: 'text-center'},
            DIV({ className: 'row'},
                DIV({className: 'col-xs-6'},
                    DIV({ className: 'traderBtn' }, 'TRADER ONE')
                ),
                DIV({className: 'col-xs-6'},
                    DIV({ className: 'traderBtn' }, 'TRADER TWO')
                )
            )
        )
    );
    }

    renderTotals() {
        return DIV({ className: 'row'},
            DIV({ className: 'col-xs-6'},
                DIV({ className: 'text-center traderHeaders' }, 'TRADER ONE'),
                DIV({ className: 'text-center bling' }, '$ ', self.state.traderOneTotal)
            ),
            DIV({ className: 'col-xs-6'},
                DIV({ className: 'text-center traderHeaders' }, 'TRADER TWO'),
                DIV({ className: 'text-center bling' }, '$ ', self.state.traderTwoTotal)
            )
        );
    }

    renderLists() {
        //each column with have a table mapped with cards and prices from an array in the state.
        return DIV({ className: 'row'},
            DIV({className: 'col-xs-6'}),
            DIV({className: 'col-xs-6'})
        );
    }

    render() {
        return DIV({},
            H3({
                className: 'text-center',
                id: 'title'
            }, 'GOGOMTG '),
            DIV({ className: 'row' },
                DIV({ className: 'col-xs-6'},
                    self.renderQueryBox(),
                    DIV({ className: 'spacer' }),
                    self.renderCardsForDropdown(),
                    self.renderSetsForDropdown(),
                    DIV({ className: 'spacer' }),
                    self.renderQueryButton(),
                    DIV({ className: 'spacer' }),
                    self.state.priceOfCard? self.renderTraderButtons() : ''
                ),
                DIV({ className: 'col-xs-6'},
                    self.renderCardInfo()
                )
            ),
            self.renderTotals(),
            self.renderLists
        );
    }
}
