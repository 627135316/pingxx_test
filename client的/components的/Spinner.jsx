import React from 'react';

import './Spinner.scss';

export class Spinner extends React.Component {
    render() {
        const bars = [];
        const props = this.props;

        for (let i = 0; i < 12; i++) {
            const barStyle = {};
            barStyle.WebkitAnimationDelay = barStyle.animationDelay = `${(i - 12) / 10}s`;
            barStyle.WebkitTransform = barStyle.transform = `rotate(${i * 30}deg) translate(146%)`;

            bars.push(
                <div style={barStyle} className="react-spinner_bar" key={i} />
            );
        }

        return (
            <div {...props} className={`${props.className || ''} react-spinner`}>
                {bars}
            </div>
        );
    }
}
