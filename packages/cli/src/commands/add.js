import fs from "fs";
import path from "path";
import { Buffer } from "buffer";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import { readConfig, configExists } from "../utils/config.js";
import {
  fetchRegistry,
  fetchRegistryAsset,
  getRegistryItemFiles,
} from "../utils/registry.js";
import {
  installDependencies,
  getMissingDependencies,
} from "../utils/package-manager.js";
import { getAuthToken } from "../utils/auth.js";

const APP_URL =
  process.env.HYPERIUX_APP_URL || "https://vault.hyperiux.com";

export async function add(effectName, options = {}) {
  const cwd = process.cwd();

  if (!effectName) {
    console.log();
    console.log(chalk.red("Please provide an effect name."));
    console.log();
    console.log(chalk.dim("Example:"));
    console.log(chalk.cyan("  npx hyperiux add helix-slider"));
    console.log();
    process.exit(1);
  }

  if (!configExists(cwd)) {
    console.log();
    console.log(chalk.red("Hyperiux is not initialized in this project."));
    console.log(chalk.yellow("Run `npx hyperiux init` first."));
    console.log();
    process.exit(1);
  }

  const config = readConfig(cwd);

  console.log();
  console.log(chalk.bold(`Adding ${effectName}...`));
  console.log();

  const spinner = ora("Fetching effect from registry...").start();
  const authToken = getAuthToken();

  let registryItem;

  try {
    registryItem = await fetchRegistry(effectName, {
      token: authToken,
    });

    spinner.succeed(`Found ${chalk.cyan(registryItem.title || effectName)}`);
  } catch (error) {
    spinner.fail("Failed to fetch effect.");

    console.log();

    if (error.requiresPro) {
      console.log(chalk.red(`"${effectName}" is a Pro effect.`));
      console.log();
      console.log(chalk.yellow("Login with your Hyperiux Pro CLI token first:"));
      console.log(chalk.cyan("  npx hyperiux login"));
      console.log();
      console.log(chalk.dim("Generate your CLI token here:"));
      console.log(chalk.dim(`  ${APP_URL}/cli-auth`));
      console.log();
      console.log(chalk.dim("After login, run:"));
      console.log(chalk.cyan(`  npx hyperiux add ${effectName}`));
    } else {
      console.log(chalk.red(error.message || "Unable to fetch effect."));
    }

    console.log();
    process.exit(1);
  }

  const files = getRegistryItemFiles(registryItem, config, cwd);

  if (!files.length) {
    console.log();
    console.log(chalk.red("No installable files were found for this effect."));
    console.log();
    console.log(
      chalk.dim(
        "Check that this registry item has a valid files array in registry.json."
      )
    );
    console.log();
    process.exit(1);
  }

  const helperTargetPath = getHyperiuxImageHelperTargetPath(cwd, config);

  const willNeedHyperiuxImageHelper = files.some((file) => {
    const content = getPotentialStringContent(file);
    return content && hasNextImageImport(content);
  });

  const installableFilesForCheck = willNeedHyperiuxImageHelper
    ? [
        ...files,
        {
          targetPath: helperTargetPath,
        },
      ]
    : files;

  const existingFiles = installableFilesForCheck.filter((file) =>
    fs.existsSync(path.join(cwd, file.targetPath))
  );

  if (existingFiles.length > 0 && !options.overwrite) {
    console.log();
    console.log(chalk.yellow("The following files already exist:"));

    existingFiles.forEach((file) => {
      console.log(chalk.dim(`  ${file.targetPath}`));
    });

    if (!options.yes) {
      const { proceed } = await prompts(
        {
          type: "confirm",
          name: "proceed",
          message: "Overwrite existing files?",
          initial: false,
        },
        {
          onCancel: () => {
            console.log();
            console.log(chalk.yellow("Installation cancelled."));
            process.exit(0);
          },
        }
      );

      if (!proceed) {
        console.log();
        console.log(chalk.yellow("Installation cancelled."));
        console.log();
        process.exit(0);
      }
    }
  }

  const dependencies = registryItem.dependencies || [];
  const missingDeps = getMissingDependencies(dependencies, cwd);

  if (options.dryRun) {
    console.log();
    console.log(chalk.bold("Dry run - the following would be installed:"));
    console.log();

    console.log(chalk.cyan("Files:"));

    files.forEach((file) => {
      console.log(`  ${file.targetPath}`);
    });

    if (willNeedHyperiuxImageHelper) {
      console.log(`  ${helperTargetPath}`);
    }

    if (missingDeps.length > 0) {
      console.log();
      console.log(chalk.cyan("Dependencies:"));

      missingDeps.forEach((dependency) => {
        console.log(`  ${dependency}`);
      });
    }

    const registryDeps = registryItem.registryDependencies || [];

    if (registryDeps.length > 0) {
      console.log();
      console.log(chalk.cyan("Registry dependencies:"));

      registryDeps.forEach((dependency) => {
        console.log(`  ${dependency}`);
      });
    }

    console.log();
    process.exit(0);
  }

  if (missingDeps.length > 0) {
    const depsSpinner = ora(
      `Installing dependencies: ${missingDeps.join(", ")}...`
    ).start();

    try {
      installDependencies(missingDeps, { cwd });
      depsSpinner.succeed("Dependencies installed");
    } catch (error) {
      depsSpinner.fail("Failed to install dependencies");
      console.log();
      console.error(chalk.red(error.message));
      console.log();
      process.exit(1);
    }
  }

  const filesSpinner = ora("Writing files...").start();

  let shouldWriteHyperiuxImageHelper = false;

  try {
    for (const file of files) {
      const targetPath = path.resolve(cwd, file.targetPath);

      if (!isSafeTargetPath(cwd, targetPath)) {
        throw new Error(
          `Unsafe file path detected and blocked: "${file.targetPath}"`
        );
      }

      const targetDir = path.dirname(targetPath);

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      let content = await getFileContent(file);

      if (typeof content === "string") {
        const patchedContent = patchNextImageImport(content, config);

        if (patchedContent !== content) {
          content = patchedContent;
          shouldWriteHyperiuxImageHelper = true;
        }
      }

      fs.writeFileSync(targetPath, content);
    }

    if (shouldWriteHyperiuxImageHelper) {
      writeHyperiuxImageHelper(cwd, config);
    }

    filesSpinner.succeed("Files written successfully");
  } catch (error) {
    filesSpinner.fail("Failed to write files");
    console.log();
    console.error(chalk.red(error.message));
    console.log();
    process.exit(1);
  }

  const registryDeps = registryItem.registryDependencies || [];

  if (registryDeps.length > 0) {
    console.log();
    console.log(chalk.dim(`This effect requires: ${registryDeps.join(", ")}`));

    for (const dep of registryDeps) {
      console.log();

      await add(dep, {
        ...options,
        yes: true,
      });
    }
  }

  console.log();
  console.log(chalk.green(`Successfully added ${chalk.bold(effectName)}!`));
  console.log();

  console.log(chalk.dim("Files installed:"));

  files.forEach((file) => {
    console.log(chalk.dim(`  ${file.targetPath}`));
  });

  if (shouldWriteHyperiuxImageHelper) {
    console.log(chalk.dim(`  ${helperTargetPath}`));
  }

  console.log();
  console.log(chalk.dim("Import it in your component:"));
  console.log();

  const mainFile = getMainFile(files, registryItem);
  const importPath = getImportPath(mainFile, config, registryItem);
  const exportName = registryItem.exportName || getComponentName(effectName);
  const exportKind = registryItem.exportKind || "named";

  const importStatement =
    exportKind === "default"
      ? `import ${exportName} from "${importPath}";`
      : `import { ${exportName} } from "${importPath}";`;

  console.log(chalk.cyan(`  ${importStatement}`));
  console.log();
}

async function getFileContent(file) {
  if (file.type === "registry:asset" && file.source && !file.content) {
    return fetchRegistryAsset(file.source);
  }

  if (file.encoding === "base64") {
    return Buffer.from(file.content, "base64");
  }

  return file.content || "";
}

function getPotentialStringContent(file) {
  if (typeof file.content === "string") {
    return file.content;
  }

  if (file.encoding === "base64") {
    return "";
  }

  return "";
}

function hasNextImageImport(content) {
  return /import\s+Image\s+from\s+["']next\/image["'];?/g.test(content);
}

function patchNextImageImport(content, config) {
  const effectsAlias = config.aliases?.effects || "@/components/effects";
  const helperImportPath = `${effectsAlias}/_hyperiux/HyperiuxImage`;

  return content.replace(
    /import\s+Image\s+from\s+["']next\/image["'];?/g,
    `import Image from "${helperImportPath}";`
  );
}

function writeHyperiuxImageHelper(cwd, config) {
  const helperTargetPath = getHyperiuxImageHelperTargetPath(cwd, config);
  const helperAbsolutePath = path.resolve(cwd, helperTargetPath);

  if (!isSafeTargetPath(cwd, helperAbsolutePath)) {
    throw new Error(
      `Unsafe helper path detected and blocked: "${helperTargetPath}"`
    );
  }

  const helperDir = path.dirname(helperAbsolutePath);

  if (!fs.existsSync(helperDir)) {
    fs.mkdirSync(helperDir, { recursive: true });
  }

  fs.writeFileSync(helperAbsolutePath, getHyperiuxImageHelperContent());
}

function getHyperiuxImageHelperTargetPath(cwd, config) {
  const effectsAlias = config.aliases?.effects || "@/components/effects";

  let effectsPath = effectsAlias.replace("@/", "");

  if (fs.existsSync(path.join(cwd, "src")) && !effectsPath.startsWith("src/")) {
    effectsPath = `src/${effectsPath}`;
  }

  return normalizePath(path.join(effectsPath, "_hyperiux", "HyperiuxImage.jsx"));
}

function getHyperiuxImageHelperContent() {
  return `"use client";

import NextImage from "next/image";

const isRemoteImage = (src) => {
  return typeof src === "string" && /^https?:\\/\\//.test(src);
};

export default function HyperiuxImage({
  src,
  alt = "",
  unoptimized,
  ...props
}) {
  return (
    <NextImage
      src={src}
      alt={alt}
      unoptimized={unoptimized ?? isRemoteImage(src)}
      {...props}
    />
  );
}

export { HyperiuxImage };
`;
}

function isSafeTargetPath(cwd, targetPath) {
  const root = path.resolve(cwd);

  return targetPath === root || targetPath.startsWith(root + path.sep);
}

function getMainFile(files, registryItem) {
  if (registryItem.main) {
    const mainFile = files.find((file) => {
      return (
        file.targetPath.endsWith(registryItem.main) ||
        file.path?.endsWith(registryItem.main)
      );
    });

    if (mainFile) return mainFile;
  }

  const indexFile = files.find((file) => {
    return /\/index\.(jsx|js|tsx|ts)$/.test(normalizePath(file.targetPath));
  });

  if (indexFile) return indexFile;

  return files[0];
}

function getImportPath(file, config, registryItem) {
  if (registryItem.importPath) {
    return registryItem.importPath;
  }

  const targetPath = normalizePath(file.targetPath);
  const effectsAlias = config.aliases?.effects || "@/components/effects";
  const effectsPath = normalizePath(effectsAlias.replace("@/", "src/"));

  if (targetPath.startsWith(effectsPath)) {
    let relativePath = targetPath.replace(effectsPath, "");

    relativePath = relativePath.replace(/^\/+/, "");

    relativePath = relativePath
      .replace(/\/index\.(jsx|js|tsx|ts)$/, "")
      .replace(/\.(jsx|js|tsx|ts)$/, "");

    return `${effectsAlias}${relativePath ? `/${relativePath}` : ""}`;
  }

  return `@/${targetPath
    .replace(/^src\//, "")
    .replace(/\/index\.(jsx|js|tsx|ts)$/, "")
    .replace(/\.(jsx|js|tsx|ts)$/, "")}`;
}

function getComponentName(effectName) {
  return effectName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function normalizePath(value) {
  return value.replaceAll("\\", "/");
}