"use client";

import downloadApp from "@/actions/downloadApp";
import getApp from "@/actions/getApp";
import saveResult from "@/actions/saveResult";
import { AppDetails } from "@/types/AppDetails";
import Image from "next/image";
import { useState } from "react";
import ReactLogo from "./icons/React";
import Link from "next/link";

enum AnalyzeStatus {
  Idle,
  CheckingAppAvailability,
  Downloading,
  Unzipping,
  Analyzing,
  Error,
  Success,
}

export function ListItem({
  appId,
  icon,
  title,
  scoreText,
  developer,
  categories,
  url,
  description,
  installs,
  isReactNative: fetchIsReactNative,
  isActive,
  onActivate,
}: {
  appId: string;
  icon: string;
  title: string;
  scoreText: string;
  developer: string;
  categories: Array<{
    name: string;
    id: string | null;
  }>;
  url: string;
  description: string;
  installs: number;
  isReactNative: boolean | null;
  isActive: boolean;
  onActivate: () => void;
}) {
  const [isReactNative, setIsReactNative] = useState<boolean | null>(
    fetchIsReactNative
  );
  const [status, setStatus] = useState<AnalyzeStatus | null>(
    fetchIsReactNative !== null ? AnalyzeStatus.Success : AnalyzeStatus.Idle
  );
  const [appSize, setAppSize] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const handleClick = async () => {
    onActivate();

    if (fetchIsReactNative !== null) {
      return;
    }

    try {
      setStatus(AnalyzeStatus.CheckingAppAvailability);

        const financeAppError = categories[0].id === "FINANCE";

        let errorMessage =
          "An error occurred while downloading the app, probably the app is not available in the registry 😢";

        if (financeAppError) {
          errorMessage =
            "Finance App Warning: This app is not supported in our registry. " +
            "Due to security concerns, not all finance apps are included :(";
          throw new Error(errorMessage);
        }

      const app = await getApp(title, appId);

      if (!app) {
        throw new Error(errorMessage);
      }

      const { link, size } = app;

      setStatus(AnalyzeStatus.Downloading);
      setAppSize(size);

      const result = await downloadApp(link);

      setIsReactNative(result.length > 0);
      setStatus(AnalyzeStatus.Success);

      const data: AppDetails = {
        appId,
        icon,
        title,
        url,
        developer,
        scoreText,
        description,
        installs,
        categories,
        analyzeResult: result,
      };

      if (result) {
        await saveResult(data, result.length > 0);
      }
    } catch (err) {
      if (err instanceof Error) {
        // TODO: improve error handling
        setError(err);
      }

      setStatus(AnalyzeStatus.Error);
    }

    // FIXME add some fancy animation when app using React Native!
  };

  return (
    <li
      key={appId}
      className={`rounded-lg shadow-md overflow-hidden flex flex-col transition-colors duration-200 bg-white dark:bg-gray-800`}
    >
      <div className="flex items-center gap-4 p-4" onClick={handleClick}>
        <Image
          alt={`${title} icon`}
          className="w-12 h-12 object-cover rounded-md"
          height="48"
          src={icon}
          style={{
            aspectRatio: "48/48",
            objectFit: "cover",
          }}
          width="48"
          priority={false}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">
              {title}
            </h3>
            {Number(scoreText) > 0 && (
              <div className="flex items-center gap-2">
                <StarIcon className="w-4 h-4 fill-yellow-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {scoreText}
                </span>
              </div>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-nowrap overflow-ellipsis w-64">
            {developer}
          </p>
        </div>
      </div>
      {isActive && (
        <div className="mt-2 p-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-m text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap overflow-hidden text-overflow-ellipsis">
            <strong>App ID:</strong> {appId}
          </p>
          {categories[0]?.name && (
            <p className="text-m text-gray-700 dark:text-gray-300 mb-2">
              <strong>Category:</strong> {categories[0].name}
            </p>
          )}
          <div className="flex flex-col">
            <div className="flex items-start text-l text-gray-700 dark:text-gray-300 mb-2">
              <strong className="mr-2">Technology:</strong>
              <div className="flex-1">
                {status === AnalyzeStatus.CheckingAppAvailability &&
                  "Checking app availability..."}
                {status === AnalyzeStatus.Downloading && (
                  <>Downloading app binary... {appSize && `(${appSize} MB)`}</>
                )}
                {status === AnalyzeStatus.Unzipping && "Unzipping app..."}
                {status === AnalyzeStatus.Analyzing && "Analyzing app code..."}
                {status === AnalyzeStatus.Error && error && (
                  <>
                    {error.message}
                    <button
                      className="text-blue-500 underline mx-3"
                      onClick={handleClick}
                    >
                      Try again
                    </button>
                  </>
                )}
                {status === AnalyzeStatus.Success &&
                  isReactNative === null &&
                  "Unknown"}
                {status === AnalyzeStatus.Success && isReactNative === true && (
                  <div className="flex items-center">
                    <span>React Native</span>
                    <ReactLogo className="ml-2" />
                  </div>
                )}
                {status === AnalyzeStatus.Success &&
                  isReactNative === false &&
                  "Not React Native :("}
              </div>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
