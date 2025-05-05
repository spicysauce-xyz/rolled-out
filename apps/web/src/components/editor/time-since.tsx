import { formatDistance } from "date-fns";
import { useEffect, useState } from "react";

interface TimeSinceProps {
  date: string;
  children: (distance: string) => React.ReactNode;
}

export const TimeSince: React.FC<TimeSinceProps> = ({ date, children }) => {
  const [timeSince, setTimeSince] = useState<string>("");

  useEffect(() => {
    const updateTimeSince = () => {
      const distance = formatDistance(date, new Date(), {
        includeSeconds: true,
        addSuffix: true,
      });
      setTimeSince(distance);
    };

    updateTimeSince();

    const interval = setInterval(updateTimeSince, 1000);

    return () => clearInterval(interval);
  }, [date]);

  return children(timeSince);
};
