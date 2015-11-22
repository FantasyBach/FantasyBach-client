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
            height: 0
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
        this.setState({ height });
    }

    render() {
        const compClass = classNames(this.props.className, 'collapser')

        return (
           <div className={compClass} style={{ height: this.state.height }}>
               <div ref="ruler">
                   {this.props.children}
               </div>
           </div>
       );
    }
}
