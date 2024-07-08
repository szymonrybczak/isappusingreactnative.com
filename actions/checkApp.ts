"use server";

import fg from "fast-glob";
import { getDownloadPath } from "./utils";
import { dirname } from "path";


const checkApp = async (appName: string, appId: string): Promise<string[]> => {
  const globPatterns = [
    "**/*react?(-)navigation*",
    "**/*react?([^a-zA-Z])native*"
  ];

  console.log(dirname(getDownloadPath(appId)))

  const entries = await fg(globPatterns, {
    cwd: dirname(getDownloadPath(appId)),
  });

  console.log(entries);

  // TODO: grep in scenario of brownfield app
  // TODO: check for the libraries that are presented in the app binary

  return entries
};

export default checkApp;
