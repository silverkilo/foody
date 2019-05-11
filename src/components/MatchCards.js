import React from "react";
import { connect } from "react-redux";
import { swipe } from "../store";
import { useSprings, animated, interpolate } from "react-spring";
import { useGesture } from "react-use-gesture";
import Draggable from "react-draggable";
import anime from "animejs";

function MatchCard({ users, swipe }) {
  const to = i => ({
    x: 0,
    y: i * -4,
    scale: 1,
    rot: 0,
    delay: i * 100
  });
  const from = i => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });
  const trans = (r, s) =>
    `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r /
      2}deg) scale(${s})`;
  const [gone] = React.useState(() => new Set());
  const [props, set] = useSprings(users.length, i => ({
    ...to(i),
    from: from(i)
  }));
  const bind = useGesture({
    onDrag: ({
      args: [index, id, match],
      down,
      delta: [xDelta],
      direction: [xDir],
      velocity,
      ...rest
    }) => {
      console.log(rest);
      const trigger = velocity > 0.2; // If you flick hard enough it should trigger the card to fly out
      const dir = xDir < 0 ? -1 : 1; // Direction should either point left or right
      let isGone = false;
      if (!down && trigger) isGone = true; // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
      set(i => {
        if (index !== i) return; // We're only interested in changing spring-data for the current spring
        const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
        const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0); // How much the card tilts, flicking it harder makes it rotate faster
        const scale = down ? 1.1 : 1; // Active cards lift up a bit
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 }
        };
      });
      console.log(!down && isGone);
      if (!down && isGone) {
        swipe(dir === 1, id, match);
      }
    }
  });
  return props.map(({ x, y, rot, scale }, i) => {
    const {
      firstName,
      lastName,
      photoURLs,
      distance,
      preferences,
      id,
      match,
      swipe
    } = users[i];
    return (
      <animated.div
        className="all-matches"
        key={i}
        style={{
          transform: interpolate(
            [x, y],
            (x, y) => `translate3d(${x}px,${y}px,0)`
          )
        }}
      >
        {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
        <animated.div
          className={`match-card ${i !== users.length - 1 && "blurred"}`}
          {...bind(i, id, match)}
          style={{
            transform: interpolate([rot, scale], trans)
          }}
        >
          <div>
            <h1 className="match-name">
              {firstName} {lastName}
            </h1>

            <div className="match-image">
              <img src={photoURLs[0]} alt={firstName} />
            </div>

            {/* match distance will be deleted, for debugging purposes only */}
            <strong className="match-distance">{distance}</strong>
            <p className="match-prefs">{preferences.join(", ")}</p>
            <div className="match-buttons">
              <button
                className="match-button-left"
                onClick={() => swipe(false, id, match)}
              >
                Left
              </button>
              <button
                className="match-button-right"
                onClick={() => swipe(true, id, match)}
              >
                Right
              </button>
            </div>
          </div>
        </animated.div>
      </animated.div>
    );
  });
}

export default connect(
  null,
  { swipe }
)(MatchCard);
