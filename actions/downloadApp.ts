"use server";

import { load } from "cheerio";
import { getDownloadPath } from "./utils";
import { pipeline } from "stream";
import fs from "fs";
import util from "util";
import { dirname } from "path";

const pipe = util.promisify(pipeline);

const downloadApp = async (appName: string, appId: string) => {
  try {
    const data = await fetch(
      `https://apkpure.com/${appName.replace(" ", "-")}/${appId}/download`
    );

    const html = await data.text();
    const $ = load(html);
    let links = $("#version-list a")
      .map((i, link) => $(link).attr("href"))
      .get()
      .filter((href) => href.startsWith("https://d."));

    const response = await fetch(links[0]);

    const totalSize = response.headers.get("content-length");

    if (!response.ok) {
      throw new Error(`Unexpected response ${response.statusText}`);
    }

    console.log({ totalSize }); // TODO: move probably to another function and present how much data needs to be downloaded, in the best scenario we should stream updates :)

    const downloadPath = getDownloadPath(appName);
    fs.mkdirSync(dirname(downloadPath), { recursive: true });

    // @ts-ignore
    await pipe(response.body, fs.createWriteStream(downloadPath));

    return { isTwoUnzipsRequired: links[0].toLowerCase().includes("xapk")}
  } catch (e) {
    console.error(e)
    throw new Error(
      "An error occurred while download the app, probably the app is not available in the registry 😢"
    );
  }
};

export default downloadApp;
