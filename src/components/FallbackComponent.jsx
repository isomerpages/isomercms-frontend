import React from "react";

function FallbackComponent(err) {
    console.log(err)
    return <div>An error has occurred</div>;
}

export default FallbackComponent;
