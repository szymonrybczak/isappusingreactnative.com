"use server";

import fg from "fast-glob";
import { getDownloadPath } from "./utils";
import { dirname } from "path";
import { rmSync } from "fs";


const removeArtifacts = async (appName: string) => {
  try {
    rmSync(dirname(getDownloadPath(appName)), { recursive: true, force: true });
  } catch {
    console.error('Failed to remove artifacts')
  }
};

export default removeArtifacts;
