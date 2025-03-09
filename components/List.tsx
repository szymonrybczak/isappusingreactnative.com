/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/soQ9NSx5gEs
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import scraper from "google-play-scraper";
import { createClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from "next/cache";
import ListWrapper from "./ui/ListWrapper";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function List({ term }: { term: string }) {
  const apps = await scraper.search({ term, num: 3, fullDetail: true });

  const appIds = apps.map(({ appId }) => appId);

  noStore();
  const { data } = await supabase
    .from("results")
    .select("is_react_native, app_id")
    .in("app_id", appIds);

  const checkedApps = (data ?? []).map(({ app_id, is_react_native }) => {
    return { id: app_id, isReactNative: is_react_native };
  });

  if (!apps.length) {
    return (
      <div className="w-full max-w-3xl px-4">
        <div>trigger deploy</div>
        <ul className="grid grid-cols-1 gap-4" />
        <div
          className={`bg-white rounded-lg shadow-md dark:bg-gray-800 p-8 flex flex-col items-center justify-center ${
            false ? "hidden" : "flex"
          }`}
        >
          <FrownIcon className="w-12 h-12 text-gray-500 dark:text-gray-400" />
          <h3 className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-200">
            No apps found
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-center">
            It looks like there are no apps matching your search. Try searching
            for something else.
          </p>
        </div>
      </div>
    );
  }

  return <ListWrapper apps={apps} checkedApps={checkedApps} />;
}

function FrownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  );
}
