import React from 'react';
import autobind from 'autobind-decorator';

const DID_FAIL_CACHE = {};

/**
 * Attempts to load and image, but falls back to displaying children
 */
export default class extends React.Component {

    @autobind
    onError() {
        DID_FAIL_CACHE[this.props.src] = true;
        this.forceUpdate();
    }

    render() {
        const { src, children, ...props } = this.props;
        return (!src || DID_FAIL_CACHE[src]) && children ?
            React.Children.only(children) :
            <img {...props} src={src} onError={this.onError} />
    }
}
