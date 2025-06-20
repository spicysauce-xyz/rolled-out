import _ from "lodash";
import React from "react";

export function GroupBy<T, K extends keyof T>(props: {
  data: T[];
  field: K;
  divider: (value: T[K]) => React.ReactNode;
  children: (item: T) => React.ReactNode;
  visible?: (value: T[K]) => boolean;
}) {
  const { data, field, divider, children } = props;
  const groupedData = _.groupBy(data, field);

  return Object.entries(groupedData).map(([key, items]) => {
    if (props.visible && !props.visible(key as T[K])) {
      return null;
    }

    return (
      <React.Fragment key={key}>
        {divider(key as T[K])}
        {items.map(children)}
      </React.Fragment>
    );
  });
}
