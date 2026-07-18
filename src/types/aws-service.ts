export type AwsService = {
  slug: string;
  name: string;
  shortDescription: string;
  category: string;
  icon: string;
  definition: string;
  concepts: Array<{ name: string; description: string }>;
  useCases: string[];
  commonMistakes: string[];
  nextServiceSlug: string | null;
};
