import type { LearningModule, LearningModuleId, LearningModuleSlug, LearningTrack, LearningTrackId } from "@/types/learning-catalog";

export const AWS_FOUNDATIONS_TRACK_ID: LearningTrackId = "aws-foundations";

export const learningModules = [
  { id: "aws:iam", providerId: "aws", trackId: AWS_FOUNDATIONS_TRACK_ID, slug: "iam", name: "IAM", order: 1, quizAvailable: true },
  { id: "aws:s3", providerId: "aws", trackId: AWS_FOUNDATIONS_TRACK_ID, slug: "s3", name: "S3", order: 2, quizAvailable: true },
  { id: "aws:ec2", providerId: "aws", trackId: AWS_FOUNDATIONS_TRACK_ID, slug: "ec2", name: "EC2", order: 3, quizAvailable: true },
  { id: "aws:vpc", providerId: "aws", trackId: AWS_FOUNDATIONS_TRACK_ID, slug: "vpc", name: "VPC", order: 4, quizAvailable: true },
  { id: "aws:lambda", providerId: "aws", trackId: AWS_FOUNDATIONS_TRACK_ID, slug: "lambda", name: "Lambda", order: 5, quizAvailable: true },
  { id: "aws:cloudwatch", providerId: "aws", trackId: AWS_FOUNDATIONS_TRACK_ID, slug: "cloudwatch", name: "CloudWatch", order: 6, quizAvailable: true },
] as const satisfies readonly LearningModule[];

export const learningTracks = [
  {
    id: AWS_FOUNDATIONS_TRACK_ID,
    providerId: "aws",
    name: "AWS Foundations",
    description: "Podstawy usług Amazon Web Services: tożsamość, storage, compute, sieci, serverless i monitoring.",
    available: true,
    moduleIds: learningModules.map(({ id }) => id),
  },
] as const satisfies readonly LearningTrack[];

export const learningModuleSlugs = learningModules.map(({ slug }) => slug);

export function isLearningModuleSlug(value: string): value is LearningModuleSlug {
  return learningModuleSlugs.some((slug) => slug === value);
}

export function getLearningTrack(trackId: LearningTrackId) {
  return learningTracks.find((track) => track.id === trackId);
}

export function getModulesForTrack(trackId: LearningTrackId) {
  return learningModules.filter((learningModule) => learningModule.trackId === trackId).sort((a, b) => a.order - b.order);
}

export function getLearningModule(moduleId: LearningModuleId) {
  return learningModules.find((learningModule) => learningModule.id === moduleId);
}

export function getLearningModuleBySlug(slug: LearningModuleSlug) {
  return learningModules.find((learningModule) => learningModule.slug === slug);
}

export function getNextLearningModule(moduleId: LearningModuleId) {
  const current = getLearningModule(moduleId);
  if (!current) return undefined;
  return getModulesForTrack(current.trackId).find((learningModule) => learningModule.order === current.order + 1);
}
