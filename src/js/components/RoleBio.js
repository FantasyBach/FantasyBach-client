import React from 'react';
import slug from 'slug';
import { Link } from 'react-router';

import menu from './hoverMenu-decorator';

@menu({
    className: 'role-bio',
    inDelay: 1000,
    outDelay: 200
})
export default class extends React.Component {

    static propTypes = {
        role: React.PropTypes.object.isRequired
    }

    render() {
        const { role } = this.props;
        const name = role.data.name;
        const description = role.data.description;

        return (
            <div>
                <h2>{name}</h2>
                <p>{description}</p>
            </div>
        );
    }
}
