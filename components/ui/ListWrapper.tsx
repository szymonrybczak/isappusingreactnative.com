"use client";

import { useState } from "react";
import { ListItem } from "../ListItem";

function ListWrapper({
  apps,
  checkedApps,
}: {
  apps: any[];
  checkedApps: any[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="w-full max-w-3xl px-4">
      <ul className="grid grid-cols-1 gap-4">
        {apps.map(
          ({
            appId,
            title,
            icon,
            scoreText,
            categories,
            url,
            developer,
            description,
            maxInstalls,
          }) => (
            <ListItem
              key={appId}
              appId={appId}
              title={title}
              icon={icon}
              scoreText={scoreText}
              developer={developer}
              categories={categories}
              url={url}
              description={description}
              installs={maxInstalls}
              isReactNative={
                checkedApps.find(({ id }) => id === appId)?.isReactNative ??
                null
              }
              isActive={activeId === appId}
              onActivate={() => setActiveId(appId)}
            />
          )
        )}
      </ul>
    </div>
  );
}

export default ListWrapper;
