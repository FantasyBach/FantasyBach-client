import React from 'react';
import { connect } from 'react-redux';

import { middleware, RESOLVED, PENDING, REJECTED } from '../util/middleware-decorator';

@connect(state => state)
@middleware([])
export default class extends React.Component {

    render() {
        return (
            <div>
                Pick Container
                <div>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
