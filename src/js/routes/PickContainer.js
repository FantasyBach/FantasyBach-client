import React from 'react';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import find from 'lodash/collection/find';
import reduce from 'lodash/collection/reduce';
import get from 'lodash/object/get';
import classNames from 'classnames';

import {
    LOAD_LEAGUES,
    CREATE_LEAGUE,
    PICK_CONTESTANT,
    UNPICK_CONTESTANT
} from '../actions';
import { middleware, RESOLVED, PENDING, REJECTED } from '../util/middleware-decorator';
import UserIcon from '../components/UserIcon';
import UserBio from '../components/UserBio';
import RoleBio from '../components/RoleBio';
import Slot from '../components/Slot';
import Collapser from '../components/Collapser';
import OptionsMenu from '../components/OptionsMenu';

@connect(state => state)
@middleware([
    {
        key: '$leagues',
        handle: props => props.dispatch(LOAD_LEAGUES())
    }
])
export default class extends React.Component {

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            onDeck: null,
            optionsOpen: null
        };
    }

    componentWillUnmount() {
        window.document.removeEventListener('click', this.popDeck);
    }

    @autobind
    toggleOptions() {
        this.setState({ optionsOpen: !this.state.optionsOpen });
    }

    @autobind
    onDeck(user) {
        this.setState({ onDeck: user.data.id });
        window.document.addEventListener('click', this.popDeck);
    }

    @autobind
    popDeck(evt, role) {
        if (this.state.onDeck && role) {
            this.pickContestant(role.data.id, this.state.onDeck);
        }
        this.setState({ onDeck: null });
        window.document.removeEventListener('click', this.popDeck);
    }

    @autobind
    pickContestant(roleId, id) {
        const roundId = this.props.session.round;
        this.props.dispatch(PICK_CONTESTANT(roundId, roleId, id));
    }

    @autobind
    unpickContestant(role, cont) {
        const roundId = this.props.session.round;
        this.props.dispatch(UNPICK_CONTESTANT(roundId, cont.data.id, role.data.id));
    }

    @autobind
    createLeague() {
        this.props.dispatch(CREATE_LEAGUE());
    }

    render() {
        const user = this.props.session.user;
        const seasonId = this.props.session.season;
        const season = this.props.seasons[seasonId];
        const roundId = this.props.session.round;
        const round = this.props.rounds[roundId];

        const picks = user.picks[roundId];
        const left = round.data.rosterSize - reduce(picks, (count, data) => {
            return count + (data && data.contestantId ? 1 : 0);
        }, 0);

        const roles = round.data.availableRoleIds.map(id => {
            return this.props.roles[id];
        });

        const available = round.data.eligibleContestantIds.map(id => {
            return this.props.contestants[id];
        });

        const collapsed = typeof this.state.optionsOpen === "boolean" ?
            this.state.optionsOpen :
            !left;

        const leagues = [];
        let leagueName = this.props.session.leagues[0].name;
        this.props.session.leagues.forEach(data => {
            if (data.id === this.props.params.league) leagueName = data.name;
            leagues.push({
                label: data.name,
                to: data.id ? `/league/${data.id}` : '/'
            });
        });

        leagues

        const roundStart = new Date(round.data.startVoteLocalDateTime);
        const roundEnd = new Date(round.data.endVoteLocalDateTime);
        const now = new Date();
        let roundStatus = null;

        if (roundStart > now) {
            roundStatus = (
                <div className="round-status">
                    <span>{`Voting opens ${round.data.startVoteLocalDateTime}`}</span>
                </div>
            );
        } else if (roundEnd < now) {
            roundStatus = (
                <div className="round-status">
                    <span>{`Voting closed`}</span>
                </div>
            );
        }

        return (
            <div>
                <section className={this.state.onDeck ? 'onDeck pick-container' : 'pick-container'}>

                    <div className="picks">
                        <div className="bachelor">
                            <label>fName lName</label>
                        </div>
                        {roles.map(role => {
                            const pick = picks ? picks[role.data.id] : null;
                            const user = pick ? this.props.contestants[pick.contestantId] : null;

                            const content = pick ?
                                <UserIcon
                                    user={user}
                                    role={role}
                                    onClick={e => this.unpickContestant(role, user)}
                                    onDrop={e => this.popDeck(e, role)}
                                /> :
                                <Slot
                                    role={role}
                                    onClick={e => this.popDeck(e, role)}
                                    onDrop={e => this.popDeck(e, role)}
                                /> ;

                            return (
                                <RoleBio role={role}>
                                    {content}
                                    <label>{role.data.name}</label>
                                </RoleBio>
                            );
                        })}
                    </div>
                    <hr />
                    {collapsed ?
                        <span className="fa fa-chevron-down" onClick={this.toggleOptions} /> :
                        <span className="fa fa-chevron-up" onClick={this.toggleOptions} />
                    }
                    <Collapser className="options" collapsed={collapsed}>
                        {roundStatus}
                        {available.map(cont => {
                            const compClass = classNames({
                                option: true,
                                selected: !!find(picks, { contestantId: cont.data.id }),
                                onDeck: this.state.onDeck === cont.data.id
                            })
                            return (
                                <UserBio user={cont}>
                                    <UserIcon
                                        user={cont}
                                        className={compClass}
                                        onClick={e => this.onDeck(cont)}
                                        onDrag={e => this.onDeck(cont)}
                                    />
                                    <label>
                                        {cont.data.name}
                                    </label>
                                </UserBio>
                            );
                        })}
                    </Collapser>
                </section>
                <hr />
                <section className="league-section">
                    <div>

                    </div>
                    <OptionsMenu groups={[leagues, [{ label: 'Create a League', onClick: this.createLeague }]]}>
                        <h3>
                            <span className="fa fa-chevron-down" />
                            {' ' + leagueName}
                        </h3>
                    </OptionsMenu>
                </section>
                {this.props.children}
            </div>
        );
    }
}
