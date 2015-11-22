import React from 'react';
import hoist from 'hoist-non-react-statics';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import noop from 'lodash/utility/noop';

import getDisplayName from '../util/getDisplayName';

const DEFAULT_LEFT = 5;

/**
 * A Higher Order component to render a dropdown menu
 *
 ***

import React from 'react';
import menu from 'path/to/menu-decorator';

@menu(className)
class MyMenu extends React.Component {

    render() {
        const closeMenu = this.props.close;
        const openMenu = this.props.open;

        return (
            <div>
                Stuff
            </div>
        );
    }
}

export default class extends React.Component {

    render() {
        // leave this undefined and menu will open/close automatically
        // otherwise you'll have to manually change the open property
        // by listening to onClose and onOpen ( you probably never
        // need to use this property )
        const open = true;

        return (
            <MyMenu disabled={false} onOpen={noop} onClose={noop} open={open}>
                <a>Click me to open the menu!!</a>
            </MyMenu>
        );
    }
}

 ***
 */
export default function(className) {

    return function(Component) {

        class WrappedComponent extends React.Component {

            static displayName = `Menu(${getDisplayName(Component)})`

            static propTypes = {
                open: React.PropTypes.bool,
                disabled: React.PropTypes.bool,
                onOpen: React.PropTypes.func,
                onClose: React.PropTypes.func,
                className: React.PropTypes.string
            }

            static defaultProps = {
                open: null,
                disabled: false,
                onOpen: noop,
                onClose: noop,
                className: ''
            }

            constructor(props, ctx) {
                super(props, ctx);

                this.state = {
                    open: false,
                    timeout: null
                }
            }

            componentDidMount() {
                window.document.addEventListener('keydown', this.handleKeyPress);
            }

            componentWillUnmount() {
                window.document.removeEventListener('keydown', this.handleKeyPress);
            }

            // make sure it's in the screen when it opens
            componentDidUpdate() {
                if (!this.refs.container) return;
                const node = this.refs.container;

                const bounds = node.getBoundingClientRect();
                const width = document.body.clientWidth;
                const currentOffset = parseFloat(node.style.left || 0);

                const diff = bounds.left + bounds.width - currentOffset - width;
                if (diff > -10) {
                    node.style.left = -diff + 'px';
                }
            }

            @autobind
            handleKeyPress(evt) {
                if (this.state.open && evt.keyCode === 27) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    this.close();
                }
            }

            @autobind
            open() {
                if (this.props.disabled) return;
                if (this.state.timeout) clearTimeout(this.state.timeout);
                this.setState(
                    { open: true, timeout: null },
                    () => this.props.onOpen
                );
            }

            @autobind
            close() {
                if (this.props.disabled) return;
                if (this.state.timeout) clearTimeout(this.state.timeout);
                this.setState(
                    { open: false, timeout: null },
                    () => this.props.onClose
                );
            }

            @autobind
            toggle() {
                const isOpen = this.props.open === null ? this.state.open : this.props.open;
                this[isOpen ? 'close' : 'open']();
            }

            @autobind
            mouseEnter() {
                if (this.props.disabled) return;
                if (this.state.open && this.state.timeout) {
                    clearTimeout(this.state.timeout);
                    this.setState({ timeout: null });
                }

                else if (!this.state.open) {
                    const timeout = setTimeout(() => this.open(), 400);
                    this.setState({ timeout });
                }
            }

            @autobind
            mouseLeave() {
                if (this.props.disabled) return;
                if (!this.state.open && this.state.timeout) {
                    clearTimeout(this.state.timeout);
                    this.setState({ timeout: null });
                }

                else if (this.state.open) {
                    const timeout = setTimeout(() => this.close(), 400);
                    this.setState({ timeout });
                }
            }

            render() {
                const {children, open, disabled, ...props} = this.props;
                const isOpen = (open === null ? this.state.open : open) && !disabled;

                const compClass = classNames(className, {
                    menu: true,
                    open: isOpen,
                    closed: !isOpen,
                    disabled: disabled
                });

                const containerClass = classNames(
                    this.props.className,
                    'menu-container',
                );

                const childClass = classNames(
                    this.props.className
                );

                const menu = !isOpen ? null : [
                    <div key="arrow" className="menu-arrow" />,
                    <div key="container" ref="container" className={containerClass} style={{left: DEFAULT_LEFT}}>
                        <Component {...props}
                            close={this.close}
                            open={this.open} />
                    </div>
                ];

                return (
                    <div className={compClass} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
                        <span className={childClass} onClick={this.toggle}>
                            {children}
                        </span>
                        {menu}
                    </div>
                );
            }
        }

        return hoist(WrappedComponent, Component);
    }
}
