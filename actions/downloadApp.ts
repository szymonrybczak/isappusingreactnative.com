"use server";

import { getDownloadPath } from "./utils";
import { pipeline } from "stream";
import fs from "fs";
import util from "util";
import { dirname } from "path";

const pipe = util.promisify(pipeline);

const downloadApp = async (link: string, appId: string) => {
  const response = await fetch(link);

  const downloadPath = getDownloadPath(appId);
  fs.mkdirSync(dirname(downloadPath), { recursive: true });

  // @ts-ignore
  await pipe(response.body, fs.createWriteStream(downloadPath));

  return {
    isTwoUnzipsRequired: link.toString().toLowerCase().includes("xapk"),
  };
};

export default downloadApp;
