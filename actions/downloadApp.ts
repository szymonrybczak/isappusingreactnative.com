"use server";

import AdmZip from "adm-zip";

const downloadApp = async (link: string, appId: string) => {
  const response = await fetch(link);

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const zip = new AdmZip(buffer);
  const entries = zip.getEntries();

  const patterns = [/react[-]?navigation/i, /react[^a-zA-Z]?native/i];

  const matchedFiles = entries.filter(({entryName}) => 
    patterns.some(pattern => pattern.test(entryName))
  );

  return matchedFiles.map(({entryName}) => entryName);
};

export default downloadApp;
