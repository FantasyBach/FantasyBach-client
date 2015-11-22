import React from 'react';
import hoist from 'hoist-non-react-statics';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import noop from 'lodash/utility/noop';
import { decorate as mixin } from 'react-mixin';
import ClickOutsideMixin from 'react-onclickoutside';

import getDisplayName from '../util/getDisplayName';

const DEFAULT_LEFT = 5;

/**
 * A Higher Order component to render a dropdown menu
 */
export default function(className) {

    return function(Component) {

        @mixin(ClickOutsideMixin)
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
                    open: false
                }
            }

            componentDidMount() {
                window.document.addEventListener('keydown', this.handleKeyPress);
            }

            componentWillUnmount() {
                window.document.removeEventListener('keydown', this.handleKeyPress);
            }

            @autobind
            handleClickOutside() {
                this.close();
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
                this.setState(
                    { open: true },
                    () => this.props.onOpen
                );
            }

            @autobind
            close() {
                if (this.props.disabled) return;
                this.setState(
                    { open: false },
                    () => this.props.onClose
                );
            }

            @autobind
            toggle() {
                const isOpen = this.props.open === null ? this.state.open : this.props.open;
                this[isOpen ? 'close' : 'open']();
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
                    <div className={compClass}>
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
