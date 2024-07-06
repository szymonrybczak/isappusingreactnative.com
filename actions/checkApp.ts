import fg from "fast-glob";
import { getDownloadPath } from "./utils";
import { dirname } from "path";


const checkApp = async (appName: string, appId: string): Promise<boolean> => {
  "use server";

  const globPatterns = [
    "**/*react?(-)navigation*",
    "**/*react*",
    "**/*react?(-)native*",
    "!**/*reactive*",
    "!**/*reactions*"
  ];

  console.log(dirname(getDownloadPath(appName)))

  const entries = await fg(globPatterns, {
    cwd: dirname(getDownloadPath(appName)),
  });

  console.log(entries);

  // TODO: grep in scenario of brownfield app
  // TODO: check for the libraries that are presented in the app binary

  return entries.length > 0;
};

export default checkApp;
