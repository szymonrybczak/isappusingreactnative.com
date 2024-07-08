"use server";

import { getDownloadPath } from "./utils";
import { dirname } from "path";
import { rmSync } from "fs";


const removeArtifacts = async (appId: string) => {
  try {
    rmSync(dirname(getDownloadPath(appId)), { recursive: true, force: true });
  } catch {
    console.error('Failed to remove artifacts')
  }
};

export default removeArtifacts;
