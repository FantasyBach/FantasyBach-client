import React from 'react';
import hoist from 'hoist-non-react-statics';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import noop from 'lodash/utility/noop';

import getDisplayName from '../util/getDisplayName';

const DEFAULT_LEFT = 5;

/**
 * A Higher Order component to render a dropdown menu
 */
export default function(opts) {

    return function(Component) {

        class WrappedComponent extends React.Component {

            static displayName = `Menu(${getDisplayName(Component)})`

            static propTypes = {
                open: React.PropTypes.bool,
                disabled: React.PropTypes.bool,
                className: React.PropTypes.string
            }

            static defaultProps = {
                open: null,
                disabled: false,
                className: ''
            }

            constructor(props, ctx) {
                super(props, ctx);

                this.state = {
                    open: false,
                    timeout: null
                }
            }

            componentWillUnmount() {
                if (this.state.timeout) clearTimeout(this.state.timeout);
            }

            @autobind
            handleMouseEnter() {
                if (this.props.disabled) return;
                if (this.state.timeout) clearTimeout(this.state.timeout);
                const commit = () => this.setState({ open: true, timeout: null });
                if (opts.inDelay) this.setState({
                    timeout: setTimeout(commit, opts.inDelay)
                });
                else commit();
            }

            @autobind
            handleMouseLeave() {
                if (this.props.disabled) return;
                if (this.state.timeout) clearTimeout(this.state.timeout);
                const commit = () => this.setState({ open: false, timeout: null });
                if (opts.outDelay) this.setState({
                    timeout: setTimeout(commit, opts.outDelay)
                });
                else commit();
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

                const compClass = classNames(opts.className, {
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
                    <div className={compClass} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                        <span className={childClass}>
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
