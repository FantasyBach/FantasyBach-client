import React from 'react';
import { connect } from 'react-redux';
import { Route, IndexRoute, Link } from 'react-router';
import Promise from 'bluebird';
import autobind from 'autobind-decorator';

import {
    INIT_FACEBOOK,
    FACEBOOK_LOGIN,
    LOGIN,
    LOAD_CONTESTANTS,
    LOAD_USER,
    LOAD_ROUNDS,
    LOAD_ROLES,
    CHANGE_ROUND
} from './actions';
import { middleware, RESOLVED, REJECTED } from './util/middleware-decorator';
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
        watch: props => !!props.session.session,
        handle: (props, session) => session || props.dispatch(FACEBOOK_LOGIN())
    },
    {
        key: '$deps',
        watch: props => !!props.session.session,
        handle: (props, session) => session && Promise.all([
            props.dispatch(LOAD_USER()),
            props.dispatch(LOAD_CONTESTANTS()),
            props.dispatch(LOAD_ROUNDS()),
            props.dispatch(LOAD_ROLES())
        ])
    }
])
class App extends React.Component {

    @autobind
    login() {
        this.props.dispatch(LOGIN());
    }

    render() {
        const { $init, $login, $deps, loading, error } = this.props;
        let weekOptions = [];
        let round = null;

        let content = null;

        const menuOptions = [
            weekOptions,
            [
                {
                    label: "Logout",
                    onClick: () => null
                }
            ]
        ]

        // case: couldn't log in
        if (error && $init === RESOLVED && $login === REJECTED) {

            // TODO remove this:
            var splashElement = document.getElementById('splash');
            splashElement.parentNode.removeChild(splashElement);

            content = (
                <div className="login">
                    <div className="banner">
                        <div className="bg" />
                        <div className="img">
                            <img src={STATIC_URL_BASE + "/images/contestants.jpg"} />
                        </div>
                    </div>

                    <button onClick={this.login}>
                        Login with Facebook
                    </button>
                </div>
            );
        }

        // case: error
        else if (error) {
            content = <div>Error</div>;
        }

        // case: loading
        else if ($deps !== RESOLVED || !this.props.session.session) {

            // TODO remove this:
            return <div></div>;

            content = <Loading />;
        }

        else {
            content = this.props.children;

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

        return (
            <main className="app">
                <header>
                    <Link to={'/'}>
                        <img src={STATIC_URL_BASE + "/images/logo.png"} />
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
