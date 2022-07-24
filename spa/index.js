import React from 'react';
import ReactDOM from 'react-dom';
import App from "./App";

/**
 * We cannot start until we have the custom components, if any.
 */


if(process.env.ADMIN_SPA_COMPONENTS_PATH){
  import(process.env.ADMIN_SPA_COMPONENTS_PATH)
  .then((module) => {

    ReactDOM.render(
      <App/>,
      document.getElementById('root')
    );

  })
}
else{
  ReactDOM.render(
    <App/>,
    document.getElementById('root')
  );
}
