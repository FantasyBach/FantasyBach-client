import React from 'react';
import { connect } from 'react-redux';
import { Route, IndexRoute } from 'react-router';
import Promise from 'bluebird';

import { FACEBOOK_LOGIN, LOAD_SEASONS, LOAD_CONTESTANTS, LOAD_USER, LOAD_ROUNDS, LOAD_ROLES } from './actions';
import { middleware, RESOLVED } from './util/middleware-decorator';
import OptionsMenu from './components/OptionsMenu';

// Routes
import Login from './routes/Login';
import About from './routes/About';
import ViewContestant from './routes/ViewContestant';
import ViewLeague from './routes/ViewLeague';
import PickContainer from './routes/PickContainer';

@connect(state => state)
@middleware([
    {
        key: '$login',
        handle: props => props.dispatch(FACEBOOK_LOGIN())
    },
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
        let weekOptions = [];
        let round = null;

        if (this.props.$deps === RESOLVED) {
            const seasonId = this.props.session.season;
            const season = this.props.seasons[seasonId];
            const roundId = this.props.session.round;
            const rounds = season.data.roundIds.map(id => {
                return this.props.rounds[id];
            });

            round = this.props.rounds[roundId];
            weekOptions = rounds
                .filter(round => true)
                .map(round => ({
                    label: `Week ${round.data.index}`,
                    onClick: () => null,
                    selected: round.data.id === roundId
                }));
        }

        const menuOptions = [
            weekOptions,
            [
                {
                    label: "Logout",
                    onClick: () => null
                }
            ]
        ]

        return (
            <main className="app">
                <header>
                    <h1>Fantasy Bachelor</h1>
                    <OptionsMenu groups={menuOptions}>
                        <h3>{round ? `Week ${round.data.index}` : ''}</h3>
                    </OptionsMenu>
                </header>
                {this.props.loading ? null : this.props.children}
                <footer>

                </footer>
            </main>
        );
    }
}

export default (
    <Route component={App}>
        <Route component={PickContainer}>
            <Route path="/login" component={Login} />
            <Route path="/" component={Login} />
            <Route path="/league/:league" component={ViewLeague} />
        </Route>
        <Route path="/login" component={Login} />
        <Route path="/about" component={About} />
        <Route path="/contestant/:contestant" component={ViewContestant} />
    </Route>
);
