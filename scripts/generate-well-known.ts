import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const OUT_DIR = join(ROOT, "public", ".well-known");

function parseEnvFile(filePath: string): Record<string, string> {
  if (!existsSync(filePath)) {
    return {};
  }

  const result: Record<string, string> = {};

  for (const rawLine of readFileSync(filePath, "utf8").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separator = line.indexOf("=");
    if (separator === -1) {
      continue;
    }

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    result[key] = value;
  }

  return result;
}

function splitList(value: string | undefined): string[] {
  if (!value?.trim()) {
    return [];
  }

  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function writeJson(fileName: string, data: unknown) {
  writeFileSync(join(OUT_DIR, fileName), `${JSON.stringify(data, null, 2)}\n`);
}

function readVar(name: string): string {
  return process.env[name]?.trim() ?? "";
}

/** Firebase email-link continue URL path; query params are not part of AASA path match. */
const IOS_AUTH_LINKS_PATH = "/__/auth/links*";

function isEnvDisabled(value: string | undefined): boolean {
  const normalized = value?.trim().toLowerCase() ?? "";
  return ["0", "false", "no", "off"].includes(normalized);
}

function resolveIosPaths(
  configured: string[],
  includeAuthLinks: boolean,
): string[] {
  const paths = configured.length > 0 ? [...configured] : ["NOT /_/*", "/*"];
  if (!includeAuthLinks) {
    return paths;
  }

  const alreadyListed = paths.some((path) => {
    const trimmed = path.trim();
    return (
      trimmed === "/__/auth/links" ||
      trimmed === "/__/auth/links*" ||
      trimmed === "NOT /__/auth/links" ||
      trimmed === "NOT /__/auth/links*"
    );
  });
  if (alreadyListed) {
    return paths;
  }

  // Prepend so this allow wins over a later `NOT /_/*` exclusion.
  return [IOS_AUTH_LINKS_PATH, ...paths];
}

// Merge .env → .env.local. Non-empty process.env (shell/CI) wins.
const fromFiles = {
  ...parseEnvFile(join(ROOT, ".env")),
  ...parseEnvFile(join(ROOT, ".env.local")),
};

for (const [key, value] of Object.entries(fromFiles)) {
  const current = process.env[key];
  if (current === undefined || current.trim() === "") {
    process.env[key] = value;
  }
}

mkdirSync(OUT_DIR, { recursive: true });

const androidPackage = readVar("ANDROID_PACKAGE_NAME");
const androidFingerprints = splitList(
  process.env.ANDROID_SHA256_CERT_FINGERPRINTS,
);
const iosTeamId = readVar("IOS_TEAM_ID");
const iosBundleId = readVar("IOS_BUNDLE_ID");
const iosPaths = splitList(process.env.IOS_APP_PATHS);
const includeAuthLinks = !isEnvDisabled(process.env.IOS_INCLUDE_AUTH_LINKS);
const resolvedIosPaths = resolveIosPaths(iosPaths, includeAuthLinks);

const assetLinks =
  androidPackage && androidFingerprints.length > 0
    ? [
        {
          relation: ["delegate_permission/common.handle_all_urls"],
          target: {
            namespace: "android_app",
            package_name: androidPackage,
            sha256_cert_fingerprints: androidFingerprints,
          },
        },
      ]
    : [];

const appleAppSiteAssociation = {
  applinks: {
    apps: [] as string[],
    details:
      iosTeamId && iosBundleId
        ? [
            {
              appID: `${iosTeamId}.${iosBundleId}`,
              paths: resolvedIosPaths,
            },
          ]
        : [],
  },
};

writeJson("assetlinks.json", assetLinks);
writeJson("apple-app-site-association", appleAppSiteAssociation);

const missing: string[] = [];
if (!androidPackage || androidFingerprints.length === 0) {
  missing.push(
    "ANDROID_PACKAGE_NAME + ANDROID_SHA256_CERT_FINGERPRINTS (comma-separated)",
  );
}
if (!iosTeamId || !iosBundleId) {
  missing.push("IOS_TEAM_ID + IOS_BUNDLE_ID");
}

console.log(`Wrote ${OUT_DIR}/assetlinks.json`);
console.log(`Wrote ${OUT_DIR}/apple-app-site-association`);
if (missing.length > 0) {
  console.warn(
    `Well-known files are incomplete until you set:\n- ${missing.join("\n- ")}`,
  );
}
