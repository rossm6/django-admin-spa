import React from "react";

function DevmodeComponentWrapper ({ children, userSelected, devmodeRef }) {

  return (
    <userSelected.Component {...userSelected.props} ref={(el) => {
      devmodeRef.current = el;
    }}>
      {children}
    </userSelected.Component>
  );

}

export default DevmodeComponentWrapper;
