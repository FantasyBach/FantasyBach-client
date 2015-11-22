import React from 'react';
import { connect } from 'react-redux';
import { Route, IndexRoute } from 'react-router';
import Promise from 'bluebird';

import { middleware } from './util/middleware-decorator';

// Routes
import About from './routes/About';
import ViewContestant from './routes/ViewContestant';
import ViewLeague from './routes/ViewLeague';
import PickContainer from './routes/PickContainer';

@connect(state => state)
@middleware([
    {
        key: '$season',
        handle: props => props.dispatch(LOAD_SEASONS())
    },
    {
        key: '$deps',
        watch: props => 1, // TODO seasonId
        handle: (props, seasonId) => Promise.all([
            props.dispatch(LOAD_CONTESTANTS(seasonId)),
            props.dispatch(LOAD_USER(seasonId)),
            props.dispatch(LOAD_ROUNDS(seasonId)),
            props.dispatch(LOAD_ROLES(seasonId))
        ])
    }
])
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
