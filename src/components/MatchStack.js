import React from "react";
import { connect } from "react-redux";
import { swipe } from "../store";
import { useSprings, animated, interpolate } from "react-spring";

import { useGesture } from "react-use-gesture";
import MatchCard from "./MatchCard";

function MatchStack({ users, swipe }) {
  const to = i => ({
    x: 0,
    y: i * -5,
    scale: 1,
    rot: 0,
    delay: i * 200
  });
  const from = i => ({
    x: i % 2 === 0 ? -1000 : 1000,
    rot: i % 2 === 0 ? -300 : 300,
    scale: 1.5,
    y: i * -5
  });
  const trans = (r, s) =>
    `perspective(1500px) rotateX(0deg) rotateY(${r / 10}deg) rotateZ(${r /
      2}deg) scale(${s})`;
  const [{ current, swipeValue }, setState] = React.useState({
    current: users.length - 1,
    swipeValue: null
  });
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
      currentTarget
    }) => {
      const trigger = velocity > 0.2; // If you flick hard enough it should trigger the card to fly out
      const dir = xDelta > 0 ? 1 : -1; // Direction should either point left or right
      let isGone = false;
      if (!down && trigger) {
        isGone = true;
      } // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
      set(i => {
        if (index !== i) {
          return;
        } // We're only interested in changing spring-data for the current spring
        const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
        const rot = xDelta / 100 + (isGone ? dir * 10 * velocity * 2 : 0); // How much the card tilts, flicking it harder makes it rotate faster
        const scale = down ? 1.1 : 1; // Active cards lift up a bit
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 }
        };
      });
      if (!down && isGone) {
        const shouldFetchMore = index === 0;
        const val = dir === 1;
        swipe(val, id, match, shouldFetchMore);
        setState({ swipeValue: val, current });
        setTimeout(() => {
          setState({ current: index - 1, swipeValue: null });
          currentTarget.parentElement.style.display = "none";
        }, 400);
      }
    }
  });
  return props.map(({ x, y, rot, scale }, i) => {
    const { id, match } = users[i];
    return (
      <animated.div
        className="match-card-container"
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
          className={`match-card ${i === current ? "clear" : "blurred"}`}
          {...bind(i, id, match)}
          style={{
            transform: interpolate([rot, scale], trans)
          }}
        >
          <div className="match-overlay">
            <div className={i === current && swipeValue === false && "no"}>
              <i
                class={
                  i === current &&
                  swipeValue === false &&
                  "far fa-thumbs-down fa-10x"
                }
              />
            </div>

            <div className={i === current && swipeValue === true && "yes"}>
              <i
                className={
                  i === current &&
                  swipeValue === true &&
                  "far fa-thumbs-up fa-10x"
                }
              />
            </div>
          </div>
          <MatchCard {...users[i]} />
        </animated.div>
      </animated.div>
    );
  });
}

export default connect(
  null,
  { swipe }
)(MatchStack);
