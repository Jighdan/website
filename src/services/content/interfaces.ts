import type { GrayMatterFile } from "gray-matter";

export interface Note {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: Date;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  year_start: number;
  year_end: number;
  tags: string[];
  content: string;
  archived: boolean;
}

export interface GitLabTreeItem {
  id: string;
  name: string;
  type: "tree" | "blob";
  path: string;
  mode: string;
}

export interface QueryCallbackParams {
  slug: string;
  data: GrayMatterFile<string>["data"];
  content: string;
}
