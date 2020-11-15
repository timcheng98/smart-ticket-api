import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
