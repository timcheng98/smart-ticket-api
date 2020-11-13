import React from 'react';
import { Link, useHistory } from 'react-router-dom';


const NotFound = () => {
  const history = useHistory();

  return (
    <div>
      <h1>404 - Not Found!</h1>
      {/* <button onClick={() => history.goBack()}>Back</button> */}
      
    </div>
  )
};

export default NotFound;