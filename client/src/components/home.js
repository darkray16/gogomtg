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
const BR = React.DOM.br;
const A = React.DOM.a;
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
            lowPrice: '',
            medPrice: '',
            highPrice: '',
            cardLink: '',
            pictureOfCard: '',
            traderOneTotal: 0,
            traderTwoTotal: 0,
            traderOneList: [],
            traderTwoList: [],
            nameForList: ''
        };
    }

    priceCheck() {
        if(self.state.cardsForDropdown.length > 0) {
            return self.setState({ errorMessage: 'Please tap/click on a card name.'});
        }
        if(self.state.query.length === 0) {
            return self.setState({ errorMessage: 'Please enter a card name above.'});
        }
        if(!self.state.currentSet) {
            return self.setState({ errorMessage: 'Please select a set for your lookup'});
        }
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
                var lowPrice = parseFloat(JSON.parse(res.text).low).toFixed(2);
                var medPrice = parseFloat(JSON.parse(res.text).med).toFixed(2);
                var highPrice = parseFloat(JSON.parse(res.text).high).toFixed(2);
                var link = 'http://' + JSON.parse(res.text).link;
                var imgUrl = JSON.parse(res.text).imgUrl[0];
                self.setState({
                    medPrice: medPrice || 'Sorry no price data for ' + self.state.query,
                    lowPrice: lowPrice,
                    highPrice: highPrice,
                    cardLink: link,
                    pictureOfCard: imgUrl || 'Sorry no image data for ' + self.state.query,
                    query: '',
                    nameForList: self.state.query,
                    setsForDropdown: [],
                    errorMessage: ''
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

    updateTotal(event) {
        var obj = {
            name: self.state.nameForList,
            set: self.state.currentSet,
            price: parseFloat(self.state.medPrice)
        };

        if(event.target.dataset.trader === '1') {
            self.setState({
                traderOneTotal: (parseFloat(self.state.traderOneTotal) + parseFloat(self.state.medPrice)),
                traderOneList: [...self.state.traderOneList, obj]
            });
        } else {
            self.setState({
                traderTwoTotal: (parseFloat(self.state.traderTwoTotal) + parseFloat(self.state.medPrice)),
                traderTwoList: [...self.state.traderTwoList, obj]
            });
        }
    }


    updateCurrentSet(event) {
        self.setState({ currentSet: event.target.value });
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

        //filters out empty string sets
        for(var i = 0; i < data.length; i++) {
            if(data[i] !== '') {
                storage.push(data[i]);
            }
        }
        return SELECT({ className: 'form-control', id: 'setBox', onChange: (e) => { self.updateCurrentSet(e); }},
            OPTION({ value: '' }, self.state.query.length? 'Choose a set!': ''),
            storage.map((set, index) => {
                return OPTION({key: index, value: set}, set);
            })
        );
    }

    renderQueryButton() {
        return BUTTON({ type: 'submit', className: 'btn btn-default', id: 'submit', onClick: self.priceCheck }, 'GO');
    }

    renderCardInfo() {
        if(self.state.pictureOfCard) {

        return DIV({},
            IMAGE({ className: 'center-block pictureOfCard', src: self.state.pictureOfCard }),
            DIV({ className: 'row center-block pictureOfCard'},
                DIV({ className: 'col-xs-4 text-center low' },
                    'Low',
                    DIV({ className: 'text-center'}, self.state.lowPrice)
                ),
                DIV({ className: 'col-xs-4 text-center med' },
                    'Med',
                    DIV({ className: 'text-center'}, self.state.medPrice)
                ),
                DIV({ className: 'col-xs-4 text-center high' },
                    'High',
                    DIV({ className: 'text-center'}, self.state.highPrice)
                )
            ),
            DIV({ className: 'text-center'},
                A({href: self.state.cardLink}, 'Buy ' + self.state.nameForList +' on TCGplayer')
            )
        );
        }
    }

    renderQueryBox() {
        return DIV({ className: 'input-group marginBottom1' },
                    INPUT({ type: 'text',
                        className: 'form-control',
                        autoCorrect: false,
                        id: 'queryBox',
                        style: {fontSize: '50px'},
                        placeholder: 'Enter a card name',
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
                    DIV({ className: 'traderBtn', 'data-trader': '1', onClick: self.updateTotal }, 'TRADER ONE')
                ),
                DIV({className: 'col-xs-6'},
                    DIV({ className: 'traderBtn', 'data-trader': '2', onClick: self.updateTotal }, 'TRADER TWO')
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

    removeFromList(event) {
        var playerAndIndex = event.target.dataset.info;
        var arrayified = playerAndIndex.split(',');
        var player = arrayified[0];
        var index = arrayified[1];
        if(player === '1') {
            let quickPrice = self.state.traderOneList[index].price;
            self.state.traderOneList.splice(index, 1);
            self.setState({
                traderOneList: self.state.traderOneList,
                traderOneTotal: (parseFloat(self.state.traderOneTotal) - parseFloat(quickPrice)).toFixed(2)
            });
        } else {
            let quickPrice = self.state.traderTwoList[index].price;
            self.state.traderTwoList.splice(index, 1);
            self.setState({
                traderTwoList: self.state.traderTwoList,
                traderTwoTotal: (parseFloat(self.state.traderTwoTotal) - parseFloat(quickPrice)).toFixed(2)
            });
        }
    }

    renderLists() {
        return DIV({ className: 'row'},
            DIV({className: 'col-xs-6'},
                self.state.traderOneList.map((item, index) => {
                    return DIV({ key: index, className: 'row'},
                        DIV({ className: 'col-xs-2'},
                            BUTTON({
                                'data-info': 1 + ',' + index,
                                className: 'btn btn-default removeButton',
                                onClick: self.removeFromList
                            }, 'X')
                        ),
                        DIV({ className: 'col-xs-10 listItem'},
                            DIV({className: 'listName'}, item.name),
                            DIV({className: 'listSet'}, item.set),
                            DIV({className: 'listPrice'}, ' $ ' + item.price)
                        )
                    );
                })
            ),
            DIV({key: 999, className: 'col-xs-6'},
                self.state.traderTwoList.map((item, index) => {
                    return DIV({ key: index, className: 'row'},
                        DIV({ className: 'col-xs-2'},
                            BUTTON({
                                'data-info': 2 + ',' + index,
                                className: 'btn btn-default removeButton',
                                onClick: self.removeFromList
                            }, 'X')
                        ),
                        DIV({ className: 'col-xs-10 listItem'},
                            DIV({ className: 'listName'}, item.name),
                            DIV({className: 'listSet'}, item.set),
                            DIV({className: 'listPrice'}, ' $ ' + item.price)
                        )
                    );
                })
            )
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
                    self.renderSetsForDropdown(),
                    DIV({ className: 'spacer' }),
                    self.renderQueryButton(),
                    DIV({ className: 'errorMessage text-center' }, self.state.errorMessage),
                    DIV({ className: 'spacer' }),
                    self.state.medPrice? self.renderTraderButtons() : ''
                ),
                DIV({ className: 'col-xs-6'},
                self.renderCardsForDropdown(),
                    self.renderCardInfo()
                )
            ),
            BR({}),
            self.renderTotals(),
            self.renderLists()
        );
    }
}
