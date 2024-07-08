import { List } from "@/components/List";
import { Search } from "@/components/search";
import Link from "next/link";

export const maxDuration = 120;

export default function Page({
  searchParams,
}: {
  searchParams?: {
    search: string;
  };
}) {
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-3xl font font-semibold mb-4 dark:text-gray-300">Is app using React Native?</h1>
      <Search />
      {searchParams?.search && <List term={searchParams?.search} />}
      
      <div className="flex items-center justify-between w-full max-w-3xl px-4 mt-6">
        <p className="text-gray-500 dark:text-gray-400">
          Created by{" "}

          <a
            href="https://twitter.com/szymonrybczak"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline underline-offset-2"
            >
            Szymon Rybczak
            </a>
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
