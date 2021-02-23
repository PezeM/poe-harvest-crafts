import React, { useEffect } from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import './style.css';
import { mainProcess } from '../../features/ipc/mainProcess';

export const OverlayContainer = () => {
  const params = useParams();
  const routeMatch = useRouteMatch();

  console.log('params', params);
  console.log('routeMatch', routeMatch);

  useEffect(() => {
    // Sends event that overlay is rendered and can be shown
    console.log('Sending overlay ready', Date.now());
    mainProcess.sendOverlayReady();
  }, []);

  return (
    <div className='overlay-container' style={{
      background: 'rgba(129, 139, 149, 0.2)',
      width: '100vw',
      height: '100vh',
      padding: 0,
      margin: 0
    }}>
      <h1>
        Overlay elo coś tu
      </h1>
    </div>
  );
};
