import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

import menu from './menu-decorator';

/**
 * A pretty simple reuasable options menu
 *
 * See propTypes for options
 */
@menu('options-menu')
export default class OptionsMenu extends React.Component {

    static propTypes = {
        groups: React.PropTypes.arrayOf(
            React.PropTypes.arrayOf(
                React.PropTypes.shape({
                    label: React.PropTypes.string.isRequired,
                    className: React.PropTypes.string,
                    selected: React.PropTypes.bool,
                    to: React.PropTypes.string,      // one
                    href: React.PropTypes.string,    // of
                    onClick: React.PropTypes.func    // these
                })
            )
        )
    }

    render() {
        const groups = this.props.groups.map((group, i) => {
            const options = group.map(({label, selected, className, ...option}) => {
                const Tag = option.to ? Link : 'a';
                const compClass = classNames(className, {
                    'option': true,
                    'selected': selected
                });

                return (
                    <Tag className={compClass} {...option}>
                        {label}
                    </Tag>
                );
            });

            return (
                <div className="group" key={group[0].key}>
                    {options}
                </div>
            );
        });

        return (
            <div onClick={this.props.close}>
                {groups}
            </div>
        );
    }
}
