import React from 'react';

const Box = ({ x, y, w, h, angle }) => {
    return (
        <div
            style={{
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                width: `${w}px`,
                height: `${h}px`,
                transform: `rotate(${angle}rad)`,
                backgroundColor: 'white',
                border: '1px solid black',
                transformOrigin: 'center center'
            }}
        ></div>
    );
};

export default Box;
