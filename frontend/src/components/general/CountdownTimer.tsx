import { useState, useEffect } from "react";
import { Stopwatch } from "react-bootstrap-icons";

type Props = {
  initialSeconds: number;
  started: boolean;
};

function CountdownTimer({ initialSeconds, started }: Props) {
  const [seconds, setSeconds] = useState<number>(initialSeconds);
  const [timerStyle, setTimerStyle] = useState("display-3");

  useEffect(() => {
    if (started) {
      if (seconds <= 0) {
        timeRunOut();
        // Stop timer if one hour over time
        if (seconds <= -3599) {
          setSeconds(-3599);
          return;
        }
      }

      // Set up the timer
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      // Clean up the timer
      return () => clearInterval(timer);
    }
  }, [seconds, started]);

  // Handle time running out
  function timeRunOut() {
    setTimerStyle("display-3 text-danger");
  }

  // Format the remaining time (e.g., “00:05:10” for 5 minutes and 10 seconds)
  function formatTime(timeInSeconds: number) {
    const absSeconds = Math.abs(timeInSeconds);
    const minutes = Math.floor(absSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (absSeconds % 60).toString().padStart(2, "0");
    return minutes + ":" + seconds;
  }

  return (
    <div className="countdown-timer">
      <p className={timerStyle}>
        <span className="icon-link">
          <Stopwatch /> {formatTime(seconds)} {seconds < 0 ? "over" : ""}
        </span>
      </p>
    </div>
  );
}

export default CountdownTimer;
