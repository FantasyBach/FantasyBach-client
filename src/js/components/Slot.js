import React from 'react';
import { connect } from 'react-redux';
import { DropTarget, DragSource } from 'react-dnd';
import classNames from 'classnames';

import UserIcon from './UserIcon';

@connect(state => state)
@DropTarget(
    'contestant',
    {
        drop(props, monitor) {
            props.onDrop(props.role);
        }
    },
    (connect, monitor) => ({
        dropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    })
)
export default class extends React.Component {

    static propTypes = {
        role: React.PropTypes.object.isRequired,
        onClick: React.PropTypes.func,
        onDrop: React.PropTypes.func
    }

    render() {
        const { role, dropTarget, className, onClick } = this.props;
        const compClass = classNames('slot', className);

        return dropTarget(
            <div className={compClass} onClick={onClick}>
                
            </div>
        );
    }
}
