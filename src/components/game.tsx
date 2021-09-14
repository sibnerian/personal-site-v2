import React, { useState, useRef, useEffect } from 'react';
import { SpaceInvadersGame } from '../game/SpaceInvadersGame';
import { mute, unmute } from '../game/sounds';

type Props = {};

export default function Game({}: Props) {
  const [muted, setMuted] = useState(true);
  const [game, setGame] = useState<SpaceInvadersGame | null>(null);
  const canvasRef: React.MutableRefObject<HTMLCanvasElement | null> = useRef(
    null
  );
  useEffect(() => {
    if (canvasRef.current != null && game == null) {
      const game = new SpaceInvadersGame(canvasRef.current);
      setGame(game);
      game.start();
    }
  }, [canvasRef.current]);
  return (
    <div className="gameDiv animated fadeIn">
      <canvas
        className="game-canvas"
        width="900"
        height="500"
        ref={canvasRef}
      />
      <span
        className={`soundIcon ${muted ? 'soundOff' : 'soundOn'}`}
        onClick={() => {
          if (muted) {
            window.gtag('event', 'unmute', {
              'event_category': 'game',
            });
            unmute();
          } else {
            window.gtag('event', 'mute', {
              'event_category': 'game',
            });
            mute();
          }
          setMuted(!muted);
        }}
      ></span>
    </div>
  );
}
