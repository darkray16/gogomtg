import React, { Component } from 'react';
import request from 'superagent';
import Dropdown from './Dropdown';

const DIV = React.DOM.div;
const H3 = React.DOM.h3;
const INPUT = React.DOM.input;
const SPAN = React.DOM.span;
const BUTTON = React.DOM.button;
const DROPDOWN = React.createFactory(Dropdown);

var self, app, timeout;

export default class SearchBar extends Component {
    constructor(props) {
        super(props);
        self = this;
        app = props.app;
        this.state = {
            cards: [{name: 'Jace Beleren', set: 'M11'}, {name: 'Kiln Fiend', set: 'M12'}, {name: 'Steppe Lynx', set: 'M12'}],
            query: '',
            cardsForDropdown: [],
            name: '',
            set: ''
        };
    }

    requestCardsForDropdown() {
        console.log('requesting!');
        // window.clearTimeout(timeout);
        // timeout = window.setTimeout(() => {
        //     request
        //         .post('http://localhost:8200/cardsInDB')
        //         .send({
        //             query: this.state.query
        //         })
        //         .end((err, res) => {
        //             if(err){
        //                 throw err;
        //             }
        //             self.setState({cardsForDropdown: JSON.parse(res.text)});
        //         });
        // }, 200);
    }

    updateQuery(event) {
        self.setState({ query: event.target.value });
    }

    submitQuery(event) {
        if(event.keyCode === 13 || event.type === 'click') {
            request
                .post('http://localhost:8200/priceCheck')
                .send({
                    cardName: self.state.card,
                    cardSet: self.state.set
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

    render() {
        return DIV({},
            DIV({ className: 'input-group center-block marginBottom1' },
                INPUT({ type: 'text',
                className: 'form-control',
                id: 'searchBar',
                placeholder: 'Card Name',
                value: self.state.query,
                onChange: self.updateQuery,
                onKeyDown: self.submitQuery,
                onKeyUp: self.requestCardsForDropdown
            }),
                SPAN({ className: 'input-group-btn center-block' },
                    BUTTON({ id: 'searchBarButton', className: 'btn btn-default glyphicon glyphicon-search', type: 'button', onClick: self.pressQuery })
                )
            ),
            DROPDOWN({cards: self.state.cards})
        );
    }
}
