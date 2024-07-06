"use client";

import React from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((search: string) => {
    const params = new URLSearchParams(searchParams);

    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    replace(`${pathname}?${params.toString()}`);
  }, 200);

  return (
    <div className="max-w-md w-full">
      <div className="flex items-center bg-white rounded-lg shadow-md dark:bg-gray-800">
        <input
          className="flex-1 px-4 py-2 text-gray-700 bg-transparent border-none outline-none dark:text-gray-300"
          placeholder="Search apps..."
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get("search")?.toString() ?? ""}
          type="text"
        />
        <button className="px-4 py-2 text-white bg-gray-800 rounded-r-lg hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500">
          <SearchIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}