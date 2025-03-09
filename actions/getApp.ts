// @ts-nocheck
"use server";

import puppeteer from "puppeteer";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const bytesToMegabytes = (bytes: number, decimals = 2) => {
  return (bytes / (1024 * 1024)).toFixed(decimals);
};

const getFromApkPureRegistry = async (appName: string, appId: string) => {
  console.log("Starting headless browser...");
  const browser = await puppeteer.launch({
    headless: "new", // Use the new headless mode
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // Set viewport to a common desktop resolution
    await page.setViewport({ width: 1366, height: 768 });

    const url = `https://apkpure.com/${appName.replace(
      " ",
      "-"
    )}/${appId}/download`;
    console.log(`Navigating to URL: ${url}`);

    const response = await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 60000, // Increase timeout to 60 seconds
    });

    console.log(`Page loaded. Status: ${response.status()}`);
    console.log(`Final URL after potential redirects: ${page.url()}`);

    if (response.status() !== 200) {
      console.log(
        `Received ${response.status()} status. Attempting to bypass...`
      );
      await sleep(5000);
      await page.reload({ waitUntil: "networkidle0" });
      console.log(
        `Page reloaded. New status: ${(await page.reload()).status()}`
      );
    }

    console.log("Waiting for selector: #version-list a");
    await page.waitForSelector("#version-list a", { timeout: 30000 });
    console.log("Selector found");

    const links = await page.evaluate(() => {
      const elements = document.querySelectorAll("#version-list a");
      console.log(`Found ${elements.length} link elements`);
      return Array.from(elements)
        .map((el) => el.getAttribute("href"))
        .filter((href) => href && href.startsWith("https://d."));
    });

    console.log(`Extracted ${links.length} valid links:`);
    links.forEach((link, index) => console.log(`Link ${index + 1}: ${link}`));

    if (links.length > 0) {
      console.log(`Returning first link: ${links[0]}`);
      return links[0];
    } else {
      console.log("No valid links found, returning null");
      return null;
    }
  } catch (error) {
    console.error("Error occurred:", error);
    await page.screenshot({
      path: "apkpure-error-screenshot.png",
      fullPage: true,
    });
    console.log("Error screenshot saved as apkpure-error-screenshot.png");
  } finally {
    await browser.close();
    console.log("Browser closed");
  }

  return null;
};

const getApkComboLink = async (appName: string, appId: string) => {
  console.log("Starting headless browser...");
  const browser = await puppeteer.launch({
    headless: "new", // Use the new headless mode
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // Set viewport to a common desktop resolution
    await page.setViewport({ width: 1366, height: 768 });

    // Enable JavaScript on the page
    await page.setJavaScriptEnabled(true);

    const url = `https://apkcombo.com/pl/${appName.replaceAll(
      " ",
      "-"
    )}/${appId}/download/apk`;
    console.log(`Navigating to URL: ${url}`);

    const response = await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 10000, // Increase timeout to 60 seconds
    });

    console.log(`Page loaded. Status: ${response.status()}`);
    console.log(`Final URL after potential redirects: ${page.url()}`);

    if (response.status() !== 200) {
      console.log(
        `Received ${response.status()} status. Attempting to bypass...`
      );
      // Wait for a bit and try to interact with the page

      await sleep(2000);
      await page.reload({ waitUntil: "networkidle0" });
      console.log(
        `Page reloaded. New status: ${(await page.reload()).status()}`
      );
    }

    console.log("Waiting for selector: #best-variant-tab a");
    await page.waitForSelector("#best-variant-tab a", { timeout: 5000 });
    console.log("Selector found");

    const links = await page.evaluate(() => {
      const elements = document.querySelectorAll("#best-variant-tab a");
      console.log(`Found ${elements.length} link elements`);
      return Array.from(elements).map((el) => el.getAttribute("href"));
    });

    console.log(`Extracted ${links.length} links:`);
    links.forEach((link, index) => console.log(`Link ${index + 1}: ${link}`));

    if (links.length !== 0) {
      const result = links[0] + process.env.FP;
      console.log(`Returning result: ${result}`);
      return result;
    } else {
      console.log("No links found, returning null");
    }
  } catch (error) {
    console.error("Error occurred:", error);
    // await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
    // console.log('Error screenshot saved as error-screenshot.png');
  } finally {
    await browser.close();
    console.log("Browser closed");
  }

  return null;
};

const getLink = async (appName: string, appId: string) => {
  try {
    // Make parallel requests to both sources
    console.log("Getting link for", appName, appId);
    const result = await Promise.race([
      getApkComboLink(appName, appId),
      getFromApkPureRegistry(appName, appId),
    ]);

    console.log({ result });

    if (!result) {
      const [apkComboResult, apkPureResult] = await Promise.all([
        getApkComboLink(appName, appId),
        getFromApkPureRegistry(appName, appId),
      ]);

      return apkComboResult || apkPureResult || null;
    }

    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getApp = async (appName: string, appId: string) => {
  const link = await getLink(appName, appId);
  console.log({ link });

  if (!link) {
    return null;
  }

  const response = await fetch(link);

  const size = response.headers.get("content-length");

  if (!response.ok) {
    console.log("Error occurred while fetching the app", size);
    return null;
  }

  return {
    link,
    size: size && bytesToMegabytes(parseInt(size, 10)),
  };
};

export default getApp;
