import { useEffect, useRef, useState } from "react";
import { View, Dimensions } from "react-native";

export function LoadingHabits({ loop = true }) {
  const [count, setCount] = useState(0);
  let signal = useRef(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev > 5) {
          if (loop) {
            signal.current = -1;
            prev -= 1;
          } else {
            prev = 6;
          }
        } else if (prev < 2) {
          signal.current = 1;
          prev = 2;
        } else {
          prev += signal.current;
        }

        return prev;
      });
    }, 100);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  const bgColors = [
    "bg-zinc-900 border-zinc-800",
    "bg-violet-900 border-violet-700",
    "bg-violet-800 border-violet-600",
    "bg-violet-700 border-violet-500",
    "bg-violet-600 border-violet-400",
    "bg-violet-500 border-violet-300",
  ];

  return (
    <View className="flex flex-row mx-auto">
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          className={`${bgColors[index]} rounded-md border-2 ml-1  w-8 h-8`}
        />
      ))}
    </View>
  );
}
