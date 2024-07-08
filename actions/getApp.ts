"use server";

import { load } from "cheerio";

const bytesToMegabytes = (bytes: number, decimals = 2) => {
  return (bytes / (1024 * 1024)).toFixed(decimals);
}

const getFromApkPureRegistry = async (appName: string, appId: string) => {
  const data = await fetch(
    `https://apkpure.com/${appName.replace(" ", "-")}/${appId}/download`
  );

  const html = await data.text();
  const $ = load(html);
  let links = $("#version-list a")
    .map((i, link) => $(link).attr("href"))
    .get()
    .filter((href) => href.startsWith("https://d."));

  return links[0];
};

const getApkComboLink = async (appName: string, appId: string) => {
  const data = await fetch(
    `https://apkcombo.com/pl/${appName.replaceAll(
      " ",
      "-"
    )}/${appId}/download/apk`
  );

  const html = await data.text();
  const $ = load(html);
  let links = $("#best-variant-tab a")
    .map((i, link) => $(link).attr("href"))
    .get();

  if (links.length !== 0) {
    return links[0] + process.env.FP;
  }

  return null;
};

const getLink = async (appName: string, appId: string) => {
  try {
    let link = await getApkComboLink(appName, appId);

    if (!link) {
      // Sometimes apkcombo doesn't present the app at first load, so we need to make a separate request
      link = await getApkComboLink(appName, appId);

      if (!link) {
        return await getFromApkPureRegistry(appName, appId);
      }
    }

    return link;
  } catch {
    return null;
  }
};

const getApp = async (appName: string, appId: string) => {
  const link = await getLink(appName, appId);

  if (!link) {
    return null;
  }

  const response = await fetch(link);

  const size = response.headers.get("content-length");

  if (!response.ok || !size) {
    return null;
  }

  return {
    link,
    size: bytesToMegabytes(parseInt(size, 10))
  };
};

export default getApp;
