import React from 'react';
import { connect } from 'react-redux';
import { Route, IndexRoute } from 'react-router';

import About from './routes/About';
import ViewContestant from './routes/ViewContestant';
import ViewLeague from './routes/ViewLeague';
import PickContainer from './routes/PickContainer';

@connect(state => state)
class App extends React.Component {

    render() {
        return (
            <main>
                <header>
                    <h1>Fantasy Bachelor</h1>
                </header>
                {this.props.children}
                <footer>

                </footer>
            </main>
        );
    }
}

export default (
    <Route>
        <Route component={PickContainer}>
            <Route path="/" component={ViewLeague} />
            <Route path="/league/:league" component={ViewLeague} />
        </Route>

        <Route path="/about" component={About} />
        <Route path="/contestant/:contestant" component={ViewContestant} />
    </Route>
);
