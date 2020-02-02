import React from 'react';

function ErrorAlert(props) {
    return(
        <div className="error">
            <p>{props.message}</p>
        </div>
    );
};

export default ErrorAlert;