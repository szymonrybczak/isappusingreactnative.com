"use server";

import { getDownloadPath } from "./utils";
import path, { dirname } from "path";
import fg from "fast-glob";
import AdmZip from "adm-zip";

const uznip = (path: string, extractPath: string) => {
  const zip = new AdmZip(path);
  zip.extractAllTo(extractPath, true);
};

const unzipApp = async (appId: string, isSecondUnzipRequired: boolean) => {
  try {
    const downloadPath = getDownloadPath(appId);
    const downloadDirectory = dirname(downloadPath);

    uznip(downloadPath, downloadDirectory);

    if (isSecondUnzipRequired) {
      const xapkFile = await fg(["**/*.apk"], {
        cwd: downloadDirectory,
      });

      const xapkPath = path.join(downloadDirectory, xapkFile[0]);
      await uznip(xapkPath, downloadDirectory);
    }
  } catch(e) {
    console.error(e)
    throw new Error("An error occurred while unzipping the app.");
  }
};

export default unzipApp;
