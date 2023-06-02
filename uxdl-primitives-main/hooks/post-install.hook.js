const fs = require('fs-extra');
const glob = require('glob');
const rootPackageJson = require('../package.json');
const dependencies = rootPackageJson.dependencies;
const packagesJsons = glob.sync(`./packages/**/package.json`);

function copyPackageJsonDeps(packageJson) {
  const data = fs.readFileSync(packageJson, 'utf8');
  const rawDependencies = Object.entries(dependencies)
    .map(([key, value]) => `\n    "${key}": "${value}"`)
    .join(',');
  const result = data.replace(/("dependencies": {)(.*)(  },\r?\n?  "peerDependencies)/gs, `$1${rawDependencies}\n$3`);

  fs.writeFileSync(packageJson, result, 'utf8');
}

packagesJsons.forEach(copyPackageJsonDeps);
