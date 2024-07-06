"use server";

import unzipper from "unzipper";
import fs from "fs";
import { getDownloadPath } from "./utils";
import path, { dirname } from "path";
import fg from "fast-glob";

const uznip = async (path: string, extractPath: string) => {
  const directory = unzipper.Extract({ path: extractPath });

  try {
    await fs
      .createReadStream(path)
      .pipe(directory)
      .on("entry", (entry) => {
        entry.autodrain().on("error", (error: Error) => console.log(error));
      })
      .promise();
  } catch {}
};

const unzipApp = async (
  appName: string,
  isSecondUnzipRequired: boolean
) => {
  try {
    const downloadPath = getDownloadPath(appName);
    const downloadDirectory = dirname(downloadPath);

    await uznip(downloadPath, downloadDirectory);

    if (isSecondUnzipRequired) {
      const xapkFile = await fg(["**/*.apk"], {
        cwd: downloadDirectory,
      });

      const xapkPath = path.join(downloadDirectory, xapkFile[0]);
      await uznip(xapkPath, downloadDirectory);
    }
  } catch {
    throw new Error("An error occurred while unzipping the app.");
  }
};

export default unzipApp;
