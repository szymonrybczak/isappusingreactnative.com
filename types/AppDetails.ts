export type AppDetails = {
  appId: string;
  url: string;
  icon: string;
  title: string;
  developer: string;
  scoreText: string;
  description: string;
  installs: number;
  categories: Array<{
    name: string;
    id: string | null;
  }>;
  analyzedFiles: string[];
  allFiles: string[];
};
