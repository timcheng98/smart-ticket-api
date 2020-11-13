import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const Public = ({
  component: AppComponent
}) => {
  return (
    <Route
      render={(props) => (
        <AppComponent  />
      )}
    />
  );
};

export default Public;
