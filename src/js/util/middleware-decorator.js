import React from 'react';
import hoist from 'hoist-non-react-statics';
import Promise from 'bluebird';
import extend from 'lodash/object/extend';
import findIndex from 'lodash/array/findIndex';
import autobind from 'autobind-decorator';

import getDisplayName from './getDisplayName';


// in lieu of symbols
export const RESOLVED = { $key: 'resolved' };
export const PENDING = { $key: 'pending' };
export const REJECTED = { $key: 'rejected' };

const defaultDep = {
    key: null,
    inject: false,
    optional: false,
    watch: props => true,
    handle: props => null
};

export function middleware(deps) {
    deps = [].concat(deps).map(dep => extend({}, defaultDep, dep));

    return function(Component) {

        class WrappedComponent extends React.Component {

            static displayName = `Injected(${getDisplayName(Component)})`

            static childContextTypes = {
                pending: React.PropTypes.func,
                error: React.PropTypes.func,
                register: React.PropTypes.func,
                unregister: React.PropTypes.func
            }

            static contextTypes = {
                pending: React.PropTypes.func,
                error: React.PropTypes.func,
                register: React.PropTypes.func,
                unregister: React.PropTypes.func
            }

            constructor(props, ctx) {
                super(props, ctx);

                this.mounted = true;
                this.pending = true;
                this.children = [];
                this.previous = [];
                this.values = [];
                this.state = {
                    loading: true,
                    error: ctx.error && ctx.error() || null,
                    ...spread(deps, 0, ctx.error && ctx.error() ? REJECTED : PENDING)
                };
            }

            getChildContext() {
                return {
                    register: instance => this.children.push(instance),
                    unregister: instance => this.children.splice(this.children.indexOf(instance), 1),
                    pending: () => this.pending,
                    error: () => this.state.error
                };
            }

            componentDidMount() {
                if (this.context.register) this.context.register(this);
                this.handleChange(this.props);
            }

            componentWillUnmount() {
                this.mounted = false;
                if (this.context.unregister) this.context.unregister(this);
            }

            componentWillReceiveProps(props) {
                if (!this.pending) this.handleChange(props);
            }

            handleChange(props) {
                if (!this.mounted) return;

                // if parent dependency failed, immediately fail
                if (this.context.error && this.context.error()) {
                    this.pending = false;
                    // update own state
                    this.setState(
                        {   loading: false,
                            error: this.context.error(),
                            ...spread(deps, 0, REJECTED) },
                        // then alert children of change
                        () => this.children.forEach(child => child.handleChange(child.props))
                    );
                    // then stop
                    return;
                }

                // if parent dependency is still loading, wait until retriggered
                if (this.context.pending && this.context.pending()) return;

                // parent dependency is finished! now load our own deps
                for (let i = 0, dep = null; dep = deps[i]; i++) {

                    // if watched value hasn't changed
                    // continue onto the next dependency
                    const watchedValue = dep.watch(props);
                    if (this.previous[i] === watchedValue && this.state[dep.key] !== PENDING) continue;

                    // We need to update!
                    // update watched value and set state
                    this.pending = true;
                    this.previous[i] = watchedValue;
                    this.setState({
                        loading: true,
                        error: null,
                        ...spread(deps, i, PENDING)
                    });

                    // handlers get the watched values as context
                    // The format is like this:
                    //
                    // handler: (props, myHandler, previousHandler, previousPreviousHandler) => // handle
                    //
                    const ctx = this.previous.slice(0, i + 1).reverse();
                    ctx.unshift(props);

                    // try the handler - accepts promises for async stuff
                    Promise.try(dep.handle, ctx).then(

                        // handle success
                        ( value ) => {
                            if (!this.mounted) return;
                            if (dep.inject) this.values[i] = value;
                            this.setState({
                                error: null,
                                [dep.key]: RESOLVED
                            }, () => this.handleChange(this.props));
                        },

                        // handle error
                        ( error ) => {
                            if (!this.mounted) return;
                            console.warn(error); // for debugging TODO remove in prod

                            // if optional, mark key as failed and continue
                            if (dep.optional) {
                                this.setState({
                                    [dep.key]: REJECTED
                                }, () => this.handleChange(this.props));
                            } else {
                                // otherwise... giveup and notify children
                                this.setState(
                                    {
                                        loading: false,
                                        error: error,
                                        ...spread(deps, i, REJECTED)
                                    },
                                    () => {
                                        if (!this.pending) return;
                                        this.pending = false;
                                        this.children.forEach(child => child.handleChange(child.props));
                                    }
                                );
                            }
                        }
                    );

                    // if we made it to this point then
                    // some operation is being handled
                    // and we need to wait until we get notified
                    return;
                }

                // if we reach this point then every dependency
                // has been handled successfully, finish loading
                // and notify children to start updating
                this.setState(
                    { loading: false },
                    () => {
                        if (!this.pending) return;
                        this.pending = false;
                        this.children.forEach(child => child.handleChange(child.props));
                    }
                );
            }

            @autobind
            fetch(key) {
                return this.values[findIndex(deps, { key })];
            }

            render() {
                return <Component {...this.props} {...this.state} fetch={this.fetch} />
            }
        }

        return hoist(WrappedComponent, Component);
    }
}

function spread(deps, i, type) {
    const obj = {};
    for(; i < deps.length; i++) {
        obj[deps[i].key] = type;
    }
    return obj;
}
