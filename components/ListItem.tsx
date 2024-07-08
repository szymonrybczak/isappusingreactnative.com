"use client";

import checkApp from "@/actions/checkApp";
import downloadApp from "@/actions/downloadApp";
import getApp from "@/actions/getApp";
import removeArtifacts from "@/actions/removeArtifacts";
import saveResult from "@/actions/saveResult";
import unzipApp from "@/actions/unzipApp";
import { AppDetails } from "@/types/AppDetails";
import Image from "next/image";
import { useState } from "react";

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
  isReactNative: fetchIsReactNative
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
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [isReactNative, setIsReactNative] = useState<boolean | null>(
    fetchIsReactNative
  );
  const [status, setStatus] = useState<AnalyzeStatus | null>(
    fetchIsReactNative !== null ? AnalyzeStatus.Success : AnalyzeStatus.Idle
  );
  const [appSize, setAppSize] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const handleClick = async () => {
    setShowDetails((prev) => !prev);

    if (fetchIsReactNative !== null) {
      return;
    }

    try {
      setStatus(AnalyzeStatus.CheckingAppAvailability);
      const app = await getApp(title, appId);

      if (!app) {
        throw new Error(
          "An error occurred while download the app, probably the app is not available in the registry 😢"
        ); 
      }

      const { link, size } = app;

      setStatus(AnalyzeStatus.Downloading)
      setAppSize(size);

      const { isTwoUnzipsRequired } = await downloadApp(link, appId);

      setStatus(AnalyzeStatus.Unzipping);
      await unzipApp(appId, isTwoUnzipsRequired);

      setStatus(AnalyzeStatus.Analyzing);
      const result = await checkApp(title, appId);

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
        setError(err);
      }

      setStatus(AnalyzeStatus.Error);
    } finally {
      removeArtifacts(title);
    }

    // FIXME add some fancy animation when app using React Native!
  };

  return (
    <li
      key={appId}
      className={`rounded-lg shadow-md overflow-hidden flex flex-col transition-colors duration-200 ${
        showDetails
          ? "bg-gray-100 dark:bg-blue-900"
          : "bg-white dark:bg-gray-800"
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-4 p-4">
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
      {showDetails && (
        <div className="mt-4 p-4 border-t border-gray-400 dark:border-gray-700">
          <p className="text-m text-gray-700 dark:text-gray-300 mb-2">
            <strong>App ID:</strong> {appId}
          </p>
          <div className="flex flex-col">
            <p className="flex items-center text-l text-gray-700 dark:text-gray-300 mb-2">
              <strong className="mr-2">Technology:</strong>
              {status === AnalyzeStatus.CheckingAppAvailability && "Checking app availability..."}
              {status === AnalyzeStatus.Downloading && (
                <>Downloading app binary... {appSize && `(${appSize} MB)`}</>
              )}
              {status === AnalyzeStatus.Unzipping && "Unzipping app..."}
              {status === AnalyzeStatus.Analyzing && "Analyzing app code..."}
              {status === AnalyzeStatus.Error && error && error.message}
              {status === AnalyzeStatus.Success &&
                isReactNative === null &&
                "Unknown"}
              {status === AnalyzeStatus.Success && isReactNative === true && (
                <>
                  <span>React Native</span>
                  <ReactLogo className="ml-2" />
                </>
              )}
              {status === AnalyzeStatus.Success &&
                isReactNative === false &&
                "Not React Native :("}
            </p>
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

function ReactLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      width="20px"
      height="20px"
      viewBox="0 0 569 512"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>React</title>
      <g
        id="Page-1"
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
      >
        <g id="React-Logo-Filled-(1)" fill="#087EA4" fill-rule="nonzero">
          <path
            d="M285.5,201 C255.400481,201 231,225.400481 231,255.5 C231,285.599519 255.400481,310 285.5,310 C315.599519,310 340,285.599519 340,255.5 C340,225.400481 315.599519,201 285.5,201"
            id="Path"
          ></path>
          <path
            d="M568.959856,255.99437 C568.959856,213.207656 529.337802,175.68144 466.251623,150.985214 C467.094645,145.423543 467.85738,139.922107 468.399323,134.521063 C474.621631,73.0415145 459.808523,28.6686204 426.709856,9.5541429 C389.677085,-11.8291748 337.36955,3.69129898 284.479928,46.0162134 C231.590306,3.69129898 179.282771,-11.8291748 142.25,9.5541429 C109.151333,28.6686204 94.3382249,73.0415145 100.560533,134.521063 C101.102476,139.922107 101.845139,145.443621 102.708233,151.02537 C97.4493791,153.033193 92.2908847,155.161486 87.3331099,157.39017 C31.0111824,182.708821 0,217.765415 0,255.99437 C0,298.781084 39.6220545,336.307301 102.708233,361.003527 C101.845139,366.565197 101.102476,372.066633 100.560533,377.467678 C94.3382249,438.947226 109.151333,483.32012 142.25,502.434597 C153.629683,508.887578 166.52439,512.186771 179.603923,511.991836 C210.956328,511.991836 247.567589,495.487529 284.479928,465.972527 C321.372196,495.487529 358.003528,511.991836 389.396077,511.991836 C402.475265,512.183856 415.36922,508.884856 426.75,502.434597 C459.848667,483.32012 474.661775,438.947226 468.439467,377.467678 C467.897524,372.066633 467.134789,366.565197 466.291767,361.003527 C529.377946,336.347457 569,298.761006 569,255.99437 M389.155214,27.1025182 C397.565154,26.899606 405.877839,28.9368502 413.241569,33.0055186 C436.223966,46.2772304 446.540955,82.2775015 441.522965,131.770345 C441.181741,135.143488 440.780302,138.556788 440.298575,141.990165 C414.066922,134.08804 387.205771,128.452154 360.010724,125.144528 C343.525021,103.224055 325.192524,82.7564475 305.214266,63.9661533 C336.586743,39.7116483 366.032313,27.1025182 389.135142,27.1025182 M378.356498,310.205598 C368.204912,327.830733 357.150626,344.919965 345.237759,361.405091 C325.045049,363.479997 304.758818,364.51205 284.459856,364.497299 C264.167589,364.51136 243.888075,363.479308 223.702025,361.405091 C211.820914,344.919381 200.80007,327.83006 190.683646,310.205598 C180.532593,292.629285 171.306974,274.534187 163.044553,255.99437 C171.306974,237.454554 180.532593,219.359455 190.683646,201.783142 C200.784121,184.229367 211.770999,167.201087 223.601665,150.764353 C243.824636,148.63809 264.145559,147.579168 284.479928,147.591877 C304.772146,147.579725 325.051559,148.611772 345.237759,150.68404 C357.109048,167.14607 368.136094,184.201112 378.27621,201.783142 C388.419418,219.363718 397.644825,237.458403 405.915303,255.99437 C397.644825,274.530337 388.419418,292.625022 378.27621,310.205598 M419.724813,290.127366 C426.09516,307.503536 431.324985,325.277083 435.380944,343.334682 C417.779633,348.823635 399.836793,353.149774 381.668372,356.285142 C388.573127,345.871232 395.263781,335.035679 401.740334,323.778483 C408.143291,312.655143 414.144807,301.431411 419.805101,290.207679 M246.363271,390.377981 C258.848032,391.140954 271.593728,391.582675 284.5,391.582675 C297.406272,391.582675 310.232256,391.140954 322.737089,390.377981 C310.880643,404.583418 298.10766,417.997563 284.5,430.534446 C270.921643,417.999548 258.18192,404.585125 246.363271,390.377981 Z M187.311556,356.244986 C169.137286,353.123646 151.187726,348.810918 133.578912,343.334682 C137.618549,325.305649 142.828222,307.559058 149.174827,290.207679 C154.754833,301.431411 160.736278,312.655143 167.239594,323.778483 C173.74291,334.901824 180.467017,345.864539 187.311556,356.285142 M149.174827,221.760984 C142.850954,204.473938 137.654787,186.794745 133.619056,168.834762 C151.18418,163.352378 169.085653,159.013101 187.211197,155.844146 C180.346585,166.224592 173.622478,176.986525 167.139234,188.210257 C160.65599,199.433989 154.734761,210.517173 149.074467,221.760984 M322.616657,121.590681 C310.131896,120.827708 297.3862,120.385987 284.379568,120.385987 C271.479987,120.385987 258.767744,120.787552 246.242839,121.590681 C258.061488,107.383537 270.801211,93.9691137 284.379568,81.4342157 C297.99241,93.9658277 310.765727,107.380324 322.616657,121.590681 Z M401.70019,188.210257 C395.196875,176.939676 388.472767,166.09743 381.527868,155.68352 C399.744224,158.819049 417.734224,163.151949 435.380944,168.654058 C431.331963,186.680673 426.122466,204.426664 419.785029,221.781062 C414.205023,210.55733 408.203506,199.333598 401.720262,188.230335 M127.517179,131.790423 C122.438973,82.3176579 132.816178,46.2973086 155.778503,33.0255968 C163.144699,28.9632474 171.455651,26.9264282 179.864858,27.1225964 C202.967687,27.1225964 232.413257,39.7317265 263.785734,63.9862316 C243.794133,82.7898734 225.448298,103.270812 208.949132,125.204763 C181.761691,128.528025 154.90355,134.14313 128.661281,141.990165 C128.199626,138.556788 127.778115,135.163566 127.456963,131.790423 M98.4529773,182.106474 C101.54406,180.767925 104.695358,179.429376 107.906872,178.090828 C114.220532,204.735668 122.781793,230.7969 133.498624,255.99437 C122.761529,281.241316 114.193296,307.357063 107.8868,334.058539 C56.7434387,313.076786 27.0971497,284.003505 27.0971497,255.99437 C27.0971497,229.450947 53.1907013,202.526037 98.4529773,182.106474 Z M155.778503,478.963143 C132.816178,465.691432 122.438973,429.671082 127.517179,380.198317 C127.838331,376.825174 128.259842,373.431953 128.721497,369.978497 C154.953686,377.878517 181.814655,383.514365 209.009348,386.824134 C225.500295,408.752719 243.832321,429.233234 263.805806,448.042665 C220.069,481.834331 180.105722,492.97775 155.838719,478.963143 M441.502893,380.198317 C446.520883,429.691161 436.203894,465.691432 413.221497,478.963143 C388.974566,493.017906 348.991216,481.834331 305.274481,448.042665 C325.241364,429.232737 343.566681,408.752215 360.050868,386.824134 C387.245915,383.516508 414.107066,377.880622 440.338719,369.978497 C440.820446,373.431953 441.221885,376.825174 441.563109,380.198317 M461.193488,334.018382 C454.869166,307.332523 446.294494,281.231049 435.561592,255.99437 C446.289797,230.744081 454.857778,204.629101 461.173416,177.930202 C512.216417,198.911955 541.942994,227.985236 541.942994,255.99437 C541.942994,284.003505 512.296705,313.076786 461.153344,334.058539"
            id="Shape"
          ></path>
        </g>
      </g>
    </svg>
  );
}
