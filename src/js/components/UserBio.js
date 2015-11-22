import React from 'react';

import menu from './menu-decorator';

@menu('user-bio')
export default class extends React.Component {

    render() {

        return (
            <div>
                <h1>Test</h1>
            </div>
        );
    }
}
