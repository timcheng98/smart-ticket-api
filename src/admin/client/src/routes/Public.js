import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const Public = ({
  component: AppComponent
}) => {
  return (
    <Route
      render={() => (
        <AppComponent  />
      )}
    />
  );
};

export default Public;
