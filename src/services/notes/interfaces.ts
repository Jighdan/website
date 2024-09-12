export interface Note {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: Date;
}

export interface GitLabTreeItem {
  id: string;
  name: string;
  type: 'tree' | 'blob';
  path: string;
  mode: string;
}
