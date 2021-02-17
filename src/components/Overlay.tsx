import React from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';

export const Overlay = () => {
  const params = useParams();
  const routeMatch = useRouteMatch();

  console.log('params', params);
  console.log('routeMatch', routeMatch);

  return (
    <div>
      <h1>
        Overlay elo
      </h1>
    </div>
  );
};
