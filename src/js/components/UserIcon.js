import React from 'react';
import classNames from 'classnames';
import { DragSource, DropTarget } from 'react-dnd';

import FallbackImage from './FallbackImage';

@DropTarget(
    'contestant',
    {
        drop(props, monitor) {
            props.onDrop(props.role);
            return {};
        },

        canDrop(props) {
            return !!props.onDrop;
        }
    },
    (connect, monitor) => ({
        dropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    })
)
@DragSource(
    'contestant',
    {
        beginDrag(props) {
            props.onDrag();
            return {};
        },

        endDrag(props) {
            if (props.onEnd) props.onEnd();
        },

        canDrag(props) {
            return !!props.onDrag;
        }
    },
    (connect, monitor) => ({
        dragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    })
)
export default class extends React.Component {

    static propTypes = {
        user: React.PropTypes.object.isRequired,
        onClick: React.PropTypes.func.isRequired,
        onDrag: React.PropTypes.func.isRequired
    }

    render() {
        const { user, className, onClick, dragSource, dropTarget } = this.props;
        const compClass = classNames('user-icon', className);

        return dropTarget(dragSource(
            <div className={compClass} onClick={onClick}>
                <FallbackImage className="image" src={user.data.images.head} alt={user.data.name}>
                    <div className="user-icon-fallback">
                        {user.data.name}
                    </div>
                </FallbackImage>
            </div>
        ));
    }
}
