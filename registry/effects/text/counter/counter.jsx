"use client";

import CounterOne from "./CounterOne";
import CounterTwo from "./CounterTwo";
import CounterThree from "./CounterThree";

export { CounterOne, CounterTwo, CounterThree };

export function Counter(props) {
  const { variant = "two", ...rest } = props || {};

  if (variant === "one") return <CounterOne {...rest} />;
  if (variant === "three") return <CounterThree {...rest} />;
  return <CounterTwo {...rest} />;
}

export default Counter;

