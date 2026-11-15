import { execSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const rootDirectory = join(import.meta.dirname, "..");

const packagesDirectory = "packages";

const dependencyFields = [
	"dependencies",
	"devDependencies",
	"peerDependencies",
	"optionalDependencies",
];

const semverPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

const rangePrefixPattern = /^[\^~]?/;

const readJson = (path) => {
	const text = readFileSync(path, "utf8");

	return JSON.parse(text);
};

const writeJson = (path, value) => {
	const text = `${JSON.stringify(value, null, "\t")}\n`;

	writeFileSync(path, text);
};

const readPackages = () => {
	const entries = readdirSync(join(rootDirectory, packagesDirectory), { withFileTypes: true });
	const directories = entries.filter((entry) => entry.isDirectory());

	return directories.map((directory) => {
		const path = `${packagesDirectory}/${directory.name}`;
		const manifest = readJson(join(rootDirectory, path, "package.json"));

		return { path, manifest };
	});
};

const updateDependencies = ({ manifest, packageNames, version, label }) => {
	for (const field of dependencyFields) {
		const dependencies = manifest[field];

		if (!dependencies) {
			continue;
		}

		for (const name of Object.keys(dependencies)) {
			if (!packageNames.has(name)) {
				continue;
			}

			const currentRange = dependencies[name];
			const [rangePrefix] = currentRange.match(rangePrefixPattern);
			const nextRange = `${rangePrefix}${version}`;

			if (currentRange === nextRange) {
				continue;
			}

			dependencies[name] = nextRange;

			console.log(`  ${label} ${field}.${name}: ${currentRange} -> ${nextRange}`);
		}
	}
};

const updateManifests = ({ packages, packageNames, version }) => {
	for (const { path, manifest } of packages) {
		const label = `${path}/package.json`;

		console.log(`  ${label} version: ${manifest.version} -> ${version}`);

		manifest.version = version;
		updateDependencies({ manifest, packageNames, version, label });
		writeJson(join(rootDirectory, path, "package.json"), manifest);
	}
};

const updateLockfile = () => {
	console.log("Updating package-lock.json:");

	execSync("npm install --package-lock-only", { cwd: rootDirectory, stdio: "inherit" });
};

/**
 * Sets every package in `packages/` to the version given as the first CLI argument,
 * updates their references to each other, then regenerates `package-lock.json`.
 */
const setVersion = () => {
	const version = process.argv[2];

	if (!version || !semverPattern.test(version)) {
		console.error("Usage: node scripts/set-version.js <version>   (e.g. 1.0.0-beta.1)");
		process.exit(1);
	}

	const packages = readPackages();
	const names = packages.map(({ manifest }) => manifest.name);
	const packageNames = new Set(names);

	console.log(`Setting version ${version}:`);

	updateManifests({ packages, packageNames, version });
	updateLockfile();

	console.log("Done.");
};

setVersion();
