import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import App from './app';
import Home from './components/home';

const ROUTER = React.createFactory(Router);
const ROUTE = React.createFactory(Route);

render(
    ROUTER({ history: browserHistory },
    ROUTE({ component: App },
        ROUTE({ path: '/', component: Home })
    )
), document.getElementById('container'));
