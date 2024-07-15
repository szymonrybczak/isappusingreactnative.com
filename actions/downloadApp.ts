"use server";

import AdmZip from "adm-zip";

const checkApp = (entries: AdmZip.IZipEntry[]) => {
  const patterns = [/react[-]?navigation/i, /react[^a-zA-Z]?native/i];

  const matchedFiles = entries.filter(({ entryName }) =>
    patterns.some((pattern) => pattern.test(entryName))
  );

  return matchedFiles.map(({ entryName }) => entryName);
};

const downloadApp = async (link: string, appId: string) => {
  try {
    const response = await fetch(link);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const zip = new AdmZip(buffer);
    const entries = zip.getEntries();

    if (link.includes("XAPK")) {
      const xapkEntries = entries.filter(({ entryName }) =>
        entryName.endsWith(".apk")
      );

      for (const entry of xapkEntries) {
        const xapkBuffer = zip.readFile(entry);

        if (xapkBuffer) {
          const xapkZip = new AdmZip(xapkBuffer);
          const entries = xapkZip.getEntries();

          if (entries.length > 0) {
            const result = checkApp(entries);

            if (result.length > 0) {
              return result;
            }
          }
        }
      }
    }

    return checkApp(entries);
  } catch (error) {
    return [];
  }
};

export default downloadApp;
