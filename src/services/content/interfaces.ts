import type { GrayMatterFile } from "gray-matter";

export type Modules = 'journal' | 'projects' | 'now';

export interface JournalEntry extends EntryCommon {
  title: string;
  description: string;
  date: Date;
}

export interface Project extends EntryCommon {
  title: string;
  description: string;
  year_start: number;
  year_end: number;
  tags: string[];
  archived: boolean;
  updatedAt: Date;
}

export interface NowEntry extends EntryCommon {
  location: string;
  date: Date;
};

interface EntryCommon {
  slug: string;
  content: string;
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
