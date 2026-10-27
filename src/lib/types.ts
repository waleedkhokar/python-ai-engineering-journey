export interface CourseModule {
  n: number;
  icon: string;
  title: string;
  sub: string;
  folder: string;
  start: number;
  classesLabel: string;
  projectsLabel: string;
  period: string;
  overview: string;
  topics: string[];
  classes: [string, string][];
  projects: [string, number][]; // [name, isCommunity]
  extras?: {
    leetcode?: [string, string][];
    prep?: string;
  };
}

export type StatItem = [string, string];
export type LearnTopic = [string, number, string]; // [title, courseNum, iconSlug]
export type HeroPill = [number, string, string]; // [courseNum, label, iconSlug]
export type SkillItem = [string, string]; // [name, iconSlug]
export type SkillGroup = [string, SkillItem[]];
export type FaqItem = [string, string]; // [question, answer]
