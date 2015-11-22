import React from 'react';
import { connect } from 'react-redux';

import { middleware, RESOLVED, PENDING, REJECTED } from '../util/middleware-decorator';

import { FACEBOOK_LOGIN } from '../actions';

@connect(state => state)
@middleware([])
export default class extends React.Component {

    render() {
        return (
            <div>
                Logged in: { this.props.session && this.props.session.session && this.props.session.session[0] ? this.props.session.session[0].userID : 'not today' }
            </div>
        );
    }
}
