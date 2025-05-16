import { groupBy } from "lodash";
import React from "react";

export function GroupBy<T, K extends keyof T>(props: {
  data: T[];
  field: K;
  divider: (value: T[K]) => React.ReactNode;
  children: (item: T) => React.ReactNode;
}) {
  const { data, field, divider, children } = props;
  const groupedData = groupBy(data, field);

  return Object.entries(groupedData).map(([key, items]) => {
    return (
      <React.Fragment key={key}>
        {divider(key as T[K])}
        {items.map(children)}
      </React.Fragment>
    );
  });
}
