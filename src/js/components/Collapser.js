import React from 'react';
import classNames from 'classnames';

export default class extends React.Component {

    static propTypes = {
        collapsed: React.PropTypes.bool.isRequired,
        min: React.PropTypes.number,
        max: React.PropTypes.number
    }

    static defaultProps = {
        min: 0,
        max: Number.MAX_SAFE_INTEGER
    }

    constructor(props, ctx) {
        super(props, ctx);
        this.state = {
            height: 0,
            transitioning: null
        }
    }

    componentWillReceiveProps(nextProps) {
        const { min, max, collapsed } = nextProps;
        this.setHeight(min, max, collapsed)
    }

    componentDidMount() {
        const { min, max, collapsed } = this.props;
        this.setHeight(min, max, collapsed);
    }

    setHeight(min, max, collapsed) {
        const node = this.refs.ruler;
        const h = node && !collapsed ? node.clientHeight : 0;
        const height = Math.max(min, Math.min(max, collapsed ? 0 : h));
        if (height === this.state.height) return;
        if (this.state.transition) clearTimeout(this.state.transition);
        this.setState({
            height: height,
            transition: setTimeout(() => this.setState({ transition: null }), 250)
        });
    }

    render() {
        const compClass = classNames(this.props.className, {
            collapser: true,
            collapsed: this.props.collapsed
        });

        const style = {
            overflow: this.state.transition || this.props.collapsed ? 'hidden' : 'visible',
            height: this.state.transition || this.props.collapsed ? this.state.height : undefined
        };

        return (
           <div className={compClass} style={style}>
               <div ref="ruler">
                   {this.props.children}
               </div>
           </div>
       );
    }
}
