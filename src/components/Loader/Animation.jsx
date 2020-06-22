import React from "react";
import Lottie from 'react-lottie';

const Animation = (props) => {
    const { isStopped, json, width, height, preserveAspectRatio, style } = props;
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: json,
        rendererSettings: {
            preserveAspectRatio,
        }
    };

    return (
        <Lottie options={defaultOptions}
            height={height}
            width={width}
            style={{ marginTop: 0, ...style }}
            isStopped={isStopped} />
    );
}

Animation.defaultProps = {
    width: 90,
    height: 90,
    preserveAspectRatio: 'xMidYMid slice'
}

export default (Animation);