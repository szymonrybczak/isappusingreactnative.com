"use server";

import { AppDetails } from "@/types/AppDetails";
import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

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
    // const { error } = await supabase
    //   .from('results')
    //   .upsert({
    //     app_id: appId,
    //     url,
    //     icon,
    //     title,
    //     developer,
    //     score_text: scoreText,
    //     description,
    //     installs,
    //     categories: categories[0].id,
    //     is_react_native: isReactNative,
    //     date_added: new Date().toISOString(),
    //     analyze_results: results
    //   }, {
    //     onConflict: 'app_id'
    //   });

    // if (error) throw error;
  } catch (e) {
    console.error(e);
  }
};

export default saveResult;
