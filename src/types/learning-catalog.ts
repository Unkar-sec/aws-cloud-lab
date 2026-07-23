export type CloudProviderId = "aws" | "azure" | "gcp";
export type LearningTrackId = "aws-foundations";
export type LearningModuleSlug = "iam" | "s3" | "ec2" | "vpc" | "lambda" | "cloudwatch";
export type LearningModuleId = `aws:${LearningModuleSlug}`;

export type CloudProvider = {
  id: CloudProviderId;
  name: string;
  shortName: string;
  description: string;
  available: boolean;
};

export type LearningTrack = {
  id: LearningTrackId;
  providerId?: CloudProviderId;
  name: string;
  description: string;
  available: boolean;
  moduleIds: readonly LearningModuleId[];
};

export type LearningModule = {
  id: LearningModuleId;
  providerId: CloudProviderId;
  trackId: LearningTrackId;
  slug: LearningModuleSlug;
  name: string;
  order: number;
  quizAvailable: boolean;
};
