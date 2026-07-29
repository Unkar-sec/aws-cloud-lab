import type { ScenarioDefinition } from "@/types/scenario";
import { cloudwatchWrongLambdaDimensionScenario } from "./cloudwatch-wrong-lambda-dimension";
import { ec2HttpUnreachableScenario } from "./ec2-http-unreachable";
import { iamAccessDeniedScenario } from "./iam-access-denied";
import { lambdaVpcNoInternetScenario } from "./lambda-vpc-no-internet";
import { s3PrivateObject403Scenario } from "./s3-private-object-403";
import { s3EventNotificationPrefixMismatchScenario } from "./s3-event-notification-prefix-mismatch";

const scenarios: readonly ScenarioDefinition[] = [
  iamAccessDeniedScenario,
  s3PrivateObject403Scenario,
  ec2HttpUnreachableScenario,
  lambdaVpcNoInternetScenario,
  cloudwatchWrongLambdaDimensionScenario,
  s3EventNotificationPrefixMismatchScenario,
];

export function getAllScenarios() {
  return scenarios;
}

export function getScenarioBySlug(slug: string) {
  return scenarios.find((scenario) => scenario.slug === slug);
}

export function getScenariosByProvider(providerId: string) {
  return scenarios.filter((scenario) => scenario.providerId === providerId);
}

export function getScenarioSlugs() {
  return scenarios.map(({ slug }) => slug);
}
