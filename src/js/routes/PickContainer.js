import React from 'react';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import find from 'lodash/collection/find';
import reduce from 'lodash/collection/reduce';
import classNames from 'classnames';

import { PICK_CONTESTANT, UNPICK_CONTESTANT } from '../actions';
import { middleware, RESOLVED, PENDING, REJECTED } from '../util/middleware-decorator';
import UserIcon from '../components/UserIcon';
import UserBio from '../components/UserBio';
import RoleBio from '../components/RoleBio';
import Slot from '../components/Slot';
import Collapser from '../components/Collapser';
import OptionsMenu from '../components/OptionsMenu';

@connect(state => state)
@middleware([])
export default class extends React.Component {

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            onDeck: null,
            optionsOpen: null
        };
    }

    @autobind
    toggleOptions() {
        this.setState({ optionsOpen: !this.state.optionsOpen });
    }

    @autobind
    clearDeck() {
        if (this.state.onDeck) this.setState({ onDeck: null });
    }

    @autobind
    onDeck(user) {
        this.setState({ onDeck: user.data.id })
    }

    @autobind
    popDeck(role) {
        if (this.state.onDeck) {
            this.pickContestant(role.data.id, this.state.onDeck);
            this.clearDeck();
        }
    }

    @autobind
    pickContestant(roleId, id) {
        const roundId = this.props.session.round;
        this.props.dispatch(PICK_CONTESTANT(roundId, roleId, id));
    }

    @autobind
    unpickContestant(role) {
        const roundId = this.props.session.round;
        this.props.dispatch(UNPICK_CONTESTANT(roundId, role.data.id));
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

        return (
            <div onClick={this.clearDeck}>
                <section className={this.state.onDeck ? 'onDeck pick-container' : 'pick-container'}>

                    <div className="picks">
                        <div className="bachelor">
                            <label>fName lName</label>
                        </div>
                        {roles.map(role => {
                            const pick = picks[role.data.id];
                            const user = pick ? this.props.contestants[pick.contestantId] : null;

                            const content = pick ?
                                <UserIcon
                                    user={user}
                                    role={role}
                                    onClick={this.unpickContestant}
                                    onClick={e => this.unpickContestant(role)}
                                    onDrop={e => this.popDeck(role)}
                                /> :
                                <Slot
                                    role={role}
                                    onClick={e => this.popDeck(role)}
                                    onDrop={e => this.popDeck(role)}
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
                <section>
                    <div>

                    </div>
                    <OptionsMenu groups={[]}>
                        Global
                    </OptionsMenu>
                </section>
                {this.props.children}
            </div>
        );
    }
}
