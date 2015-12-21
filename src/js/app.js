import React from 'react';
import { connect } from 'react-redux';
import { Route, IndexRoute, Link } from 'react-router';
import Promise from 'bluebird';

import {
    INIT_FACEBOOK,
    FACEBOOK_LOGIN,
    LOAD_SEASONS,
    LOAD_CONTESTANTS,
    LOAD_USER,
    LOAD_ROUNDS,
    LOAD_ROLES,
    CHANGE_ROUND
} from './actions';
import { middleware, RESOLVED } from './util/middleware-decorator';
import OptionsMenu from './components/OptionsMenu';
import Loading from './components/Loading';

// Routes
import Login from './routes/Login';
import About from './routes/About';
import ViewContestant from './routes/ViewContestant';
import ViewLeague from './routes/ViewLeague';
import GlobalLeague from './routes/GlobalLeague';
import PickContainer from './routes/PickContainer';

@connect(state => state)
@middleware([
    {
        key: '$init',
        handle: props => props.dispatch(INIT_FACEBOOK())
    },
    {
        key: '$login',
        handle: props => props.dispatch(FACEBOOK_LOGIN())
    },
    {
        key: '$season',
        handle: props => Promise.all([
            props.dispatch(LOAD_SEASONS()),
            props.dispatch(LOAD_USER(1))
        ])
    },
    {
        key: '$deps',
        watch: props => 1, // TODO seasonId
        handle: (props, seasonId) => Promise.all([
            props.dispatch(LOAD_CONTESTANTS(seasonId)),
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
                    label: `Week ${round.data.index + 1}`,
                    onClick: () => this.props.dispatch(CHANGE_ROUND(round.data.id)),
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

        let content = null;

        // case: loading
        if (this.props.loading) {
            content = <Loading />;
        }

        // case: error
        else if (this.props.error) {
            content = <div>Error</div>;
        }

        else {
            content = this.props.children;
        }

        return (
            <main className="app">
                <header>
                    <Link to={'/'}>
                        <h1>Fantasy Bachelor</h1>
                    </Link>
                    <OptionsMenu groups={menuOptions}>
                        <h3>
                            <span className="fa fa-chevron-down" />
                            {round ? ` Week ${round.data.index + 1}` : ''}
                        </h3>
                    </OptionsMenu>
                </header>
                {content}
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
            <Route path="/" component={GlobalLeague} />
            <Route path="/league/:league" component={ViewLeague} />
        </Route>
        <Route path="/login" component={Login} />
        <Route path="/about" component={About} />
        <Route path="/contestant/:contestant/:name" component={ViewContestant} />
    </Route>
);
