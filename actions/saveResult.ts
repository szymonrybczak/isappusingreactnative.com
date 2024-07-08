"use server";

import { AppDetails } from "@/types/AppDetails";
import { sql } from "@vercel/postgres";

const saveResult = async (details: AppDetails, isReactNative: boolean) => {
  const {
    appId,
    url,
    icon,
    title,
    developer,
    scoreText,
    description,
    installs,
    categories,
  } = details;

  const results = JSON.stringify(details.analyzeResult);

  try {
    await sql`
      INSERT INTO results
      (app_id, url, icon, title, developer, score_text, description, installs, categories, is_react_native, date_added, analyze_results)
      VALUES (${appId}, ${url}, ${icon}, ${title}, ${developer}, ${scoreText}, ${description}, ${installs}, ${categories[0].id}, ${isReactNative}, CURRENT_TIMESTAMP, ${results})
      
      ON CONFLICT (app_id)
      DO UPDATE SET
        url = EXCLUDED.url,
        icon = EXCLUDED.icon,
        title = EXCLUDED.title,
        developer = EXCLUDED.developer,
        score_text = EXCLUDED.score_text,
        description = EXCLUDED.description,
        installs = EXCLUDED.installs,
        categories = EXCLUDED.categories,
        is_react_native = EXCLUDED.is_react_native,
        date_added = CURRENT_TIMESTAMP,
        analyze_results = EXCLUDED.analyze_results;
    `;
  } catch (e) {
    console.error(e);
  }
  
};

export default saveResult;
