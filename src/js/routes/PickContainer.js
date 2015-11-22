import React from 'react';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import find from 'lodash/collection/find';
import classNames from 'classnames';

import { PICK_CONTESTANT, UNPICK_CONTESTANT } from '../actions';
import { middleware, RESOLVED, PENDING, REJECTED } from '../util/middleware-decorator';
import UserIcon from '../components/UserIcon';

@connect(state => state)
@middleware([])
export default class extends React.Component {

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            onDeck: null
        };
    }

    @autobind
    clearDeck() {
        // if (this.state.onDeck) this.setState({ onDeck: null });
    }

    @autobind
    onDeck(id) {
        this.setState({ onDeck: id })
    }

    @autobind
    popDeck(roleId) {
        if (this.state.onDeck) {
            this.pickContestant(roleId, this.state.onDeck);
            this.clearDeck();
        }
    }

    ignore(evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }

    @autobind
    pickContestant(roleId, id) {
        const roundId = this.props.session.round;
        this.props.dispatch(PICK_CONTESTANT(roundId, roleId, id));
    }

    @autobind
    unpickContestant(roleId) {
        const roundId = this.props.session.round;
        this.props.dispatch(UNPICK_CONTESTANT(roundId, roleId));
    }

    render() {
        const user = this.props.session.user;
        const seasonId = this.props.session.season;
        const season = this.props.seasons[seasonId];
        const roundId = this.props.session.round;
        const round = this.props.rounds[roundId];

        const picks = user.picks[roundId];

        const roles = round.data.availableRoleIds.map(id => {
            return this.props.roles[id];
        });

        const available = round.data.eligibleContestantIds.map(id => {
            return this.props.contestants[id];
        });


        return (
            <div onDragEnd={this.clearDeck} onMouseUp={this.clearDeck}>
                <section className="pick-container">

                    <div className="picks">
                        <div className="bachelor">
                            <UserIcon src={season.data.icon} name={season.data.name} />
                            <label>fName lName</label>
                        </div>
                        {roles.map(role => {
                            const pick = picks[role.data.id];

                            return pick ? (
                                <div className="slot" onClick={e => this.unpickContestant(role.data.id)} onDragEnd={e => this.popDeck(role.data.id)} onMouseUp={e => this.popDeck(role.data.id)}>
                                    <UserIcon src={this.props.contestants[pick.contestantId].data.images.large} name={role.data.name} />
                                </div>
                            ) : (
                                <div className="slot" onDragEnd={e => this.popDeck(role.data.id)} onMouseUp={e => this.popDeck(role.data.id)}>
                                    <UserIcon src="" name={role.data.name} />
                                </div>
                            );
                        })}
                    </div>

                    <div className="options">
                        {available.map(cont => {
                            const compClass = classNames({
                                option: true,
                                selected: !!find(picks, { contestantId: cont.data.id })
                            })
                            return (
                                <div className={compClass} onDragStart={e => this.onDeck(cont.data.id)} onMouseDown={e => this.onDeck(cont.data.id)}>
                                    <UserIcon src={cont.data.images.large} name={cont.data.name} />
                                </div>
                            );
                        })}
                    </div>
                </section>
                {this.props.children}
            </div>
        );
    }
}
