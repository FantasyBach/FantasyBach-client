import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { DragSource, DropTarget } from 'react-dnd';
import get from 'lodash/object/get';
import contains from 'lodash/collection/contains';

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
@connect(state => state)
export default class extends React.Component {

    static propTypes = {
        user: React.PropTypes.object.isRequired,
        onClick: React.PropTypes.func.isRequired,
        onDrag: React.PropTypes.func.isRequired
    }

    render() {
        const { user, className, onClick, dragSource, dropTarget } = this.props;
        const compClass = classNames('user-icon', className);

        const picks = this.props.session.user.picks;
        const roundId = this.props.session.round;
        const roundIds = season.data.roundIds;
        const index = roundIds.indexOf(roundId);
        const lastThreeRounds = roundIds.slice(index - 2, index).reverse();

        let multiplier = 0;
        for (let i = 0; i < lastThreeRounds.length; i++) {
            if (contains(get(picks, roundId, {}), user.id)) multiplier++;
            else break;
        }

        return dropTarget(dragSource(
            <div className={compClass} onClick={onClick}>
                <FallbackImage className="image" src={user.data.images.head} alt={user.data.name}>
                    <div className="user-icon-fallback">
                        {user.data.name}
                    </div>
                </FallbackImage>
                {multiplier ? <span className="multiplier">{'x' + (multiplier + 1)}</span> : null}
            </div>
        ));
    }
}
