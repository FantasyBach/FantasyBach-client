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
        user: React.PropTypes.object.isRequired
    }

    render() {
        const { user } = this.props;
        const id = user.data.id;
        const name = user.data.name;
        const normalized = slug(name).toLowerCase();

        return (
            <div>
                <h2>{name}</h2>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <Link to={`/contestant/${id}/${normalized}`}>
                    See their full bio
                </Link>
            </div>
        );
    }
}
