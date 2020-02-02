import React from 'react';

function Loader(props) {
    return <div className={`loader ${props.addClass ? props.addClass : ''}`}></div>;
};

export default Loader;