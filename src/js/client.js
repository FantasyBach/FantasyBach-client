import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { DragDropContext } from 'react-dnd';
import backend from 'react-dnd-html5-backend';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import app from './app';
import createStore from './createStore';

const Context = DragDropContext(backend)(Provider);
const store = createStore();
const history = createBrowserHistory();

window.store = store;

const dom = (
    <Context store={store}>
        <Router history={history}>
            {app}
        </Router>
    </Context>
);

render(dom, document.getElementById('container'));
