"use server";

import { AppDetails } from "@/types/AppDetails";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// We're saving all the results after every app analysis to the database
// 1. To have a record of all the files that were analyzed and present results faster
// 2. To make lists of apps leveraging React Native in various categories

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

  const analyzedFiles = JSON.stringify(details.analyzedFiles);
  const allFiles = JSON.stringify(details.allFiles);

  try {
    const { error } = await supabase.from("results").upsert(
      {
        app_id: appId,
        url,
        icon,
        title,
        developer,
        score_text: scoreText,
        description,
        installs,
        categories: categories[0].id,
        is_react_native: isReactNative,
        date_added: new Date().toISOString(),
        analyze_results: analyzedFiles,
        all_files: allFiles,
      },
      {
        onConflict: "app_id",
      }
    );
    if (error) throw error;
  } catch (e) {
    console.error(e);
  }
};

export default saveResult;
