import React, { useState, useEffect } from 'react';

import Index from '../components/index';
import Bizcard from '../components/bizcard';
import Game from '../components/game';
import { mute } from '../game/sounds';

export default function IndexPage() {
  const [invaderPressed, setInvaderPressed] = useState(false);
  const [hingeEffectCompleted, setHingeEffectCompleted] = useState(false);
  useEffect(() => {
    if (!invaderPressed) {
      return () => {};
    }
    const handle = setTimeout(() => {
      setHingeEffectCompleted(true);
    }, 1800);
    return () => clearTimeout(handle);
  }, [invaderPressed]);
  return (
    <Index>
      <>
        {hingeEffectCompleted && <Game />}
        {hingeEffectCompleted && (
          <span
            className="backButton"
            onClick={() => document.location.reload()}
          >
            {' '}
            &lt;&lt; Back{' '}
          </span>
        )}
        <Bizcard
          onPressInvader={() => {
            window.gtag('event', 'invader_press');
            mute();
            setInvaderPressed(true);
          }}
          invaderPressed={invaderPressed}
        />
      </>
    </Index>
  );
}
