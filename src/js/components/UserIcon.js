import React from 'react';
import classNames from 'classnames';

import FallbackImage from './FallbackImage';

export default props => {
    const { className, name, src, ...rest } = props;
    const compClass = classNames('user-icon', className);

    return (
        <div className={compClass} {...rest} draggable={true}>
            <FallbackImage className="image" src={src} alt={name}>
                <div className="user-icon-fallback">
                    {name}
                </div>
            </FallbackImage>
        </div>
    )
}
