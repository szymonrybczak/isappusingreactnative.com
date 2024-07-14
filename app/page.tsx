import ReactLogo from "@/components/icons/React";
import { List } from "@/components/List";
import { Search } from "@/components/search";
import Link from "next/link";

export const maxDuration = 180;

export default function Page({
  searchParams,
}: {
  searchParams?: {
    search: string;
  };
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-2xl md:text-3xl font-semibold mb-4 dark:text-gray-300">
        Is app using React Native?
      </h1>
      <Search />
      {searchParams?.search ? (
        <List term={searchParams?.search} />
      ) : (
        <div className="w-full max-w-3xl px-4">
          <ul className="grid grid-cols-1 gap-4" />
          <div
            className={`bg-white rounded-lg shadow-md dark:bg-gray-800 p-8 flex flex-col items-center justify-center ${
              false ? "hidden" : "flex"
            }`}
          >
            <ReactLogo className="w-12 h-12" />
            <h3 className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-200 text-center">
              Have you ever wondered if an app is using React Native?
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400 text-center text-s">
              You can search for any app to find out if it{"'"}s using React Native.
            </p>
          </div>
        </div>

      )}

      <div className="flex items-center justify-between w-full max-w-3xl px-4 mt-6">
        <p className="text-gray-500 dark:text-gray-400">
          Created by{" "}
          <Link
            href="https://twitter.com/szymonrybczak"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline underline-offset-2"
          >
            Szymon Rybczak
          </Link>
        </p>
        <Link
          href="https://github.com/szymonrybczak/isappusingreactnative.com"
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          prefetch={false}
        >
          View on GitHub
        </Link>
      </div>
    </div>
  );
}
