import React from 'react';
import { connect } from 'react-redux';

import { LOAD_MEMBERS } from '../actions';
import { middleware, RESOLVED, PENDING, REJECTED } from '../util/middleware-decorator';

@connect(state => state)
@middleware([
    {
        key: '$members',
        watch: props => props.params.league,
        handle: (props, league) => props.dispatch(LOAD_MEMBERS(league))
    }
])
export default class extends React.Component {

    render() {
        return (
            <div>
                View League
            </div>
        );
    }
}
