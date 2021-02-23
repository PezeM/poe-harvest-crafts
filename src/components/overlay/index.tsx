import React, { useEffect } from 'react';
import styles from './style.css';
import { mainProcess } from '../../features/ipc/mainProcess';

export const OverlayContainer = () => {
  useEffect(() => {
    // Sends event that overlay is rendered and can be shown
    mainProcess.sendOverlayReady();
  }, []);


  return (
    <div className={styles.overlayContainer}>
      <h1>
        Overlay elo coś tu
      </h1>
    </div>
  );
};
