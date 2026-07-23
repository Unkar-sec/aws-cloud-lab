import type { CloudProvider } from "@/types/learning-catalog";

export const cloudProviders = [
  {
    id: "aws",
    name: "Amazon Web Services",
    shortName: "AWS",
    description: "Pierwsza dostępna ścieżka CloudOps Lab.",
    available: true,
  },
  {
    id: "azure",
    name: "Microsoft Azure",
    shortName: "Azure",
    description: "Planowana ścieżka edukacyjna.",
    available: false,
  },
  {
    id: "gcp",
    name: "Google Cloud",
    shortName: "Google Cloud",
    description: "Planowana ścieżka edukacyjna.",
    available: false,
  },
] as const satisfies readonly CloudProvider[];

export function getCloudProvider(providerId: CloudProvider["id"]) {
  return cloudProviders.find((provider) => provider.id === providerId);
}
