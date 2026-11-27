// China by the Numbers — the entrypoint (Node 22, standard library only).
// It hands the site in: the static files under app/ and the screenshots of
// the site running are copied to the output directory, and dossier.json is
// written there with the vendored make.fun library, the summary the judge
// reads (screenshots, first-load bytes, and the site's own source).
//
// The site itself is plain static files in app/ (HTML, CSS, ES modules, no
// build step, no network requests). Serve it locally with `node serve.ts`,
// then open http://localhost:8080. Outside the grader, MAKEFUN_OUTPUT_DIR
// stands in for /output:
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Leave vendor/makefun-frontend.ts as it is: the scorer rebuilds the dossier
// with its own copy and requires the two to match byte for byte.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The repository root is the directory this file lives in.
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
// The grader writes to /output; a local run uses MAKEFUN_OUTPUT_DIR instead.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function copyTree(from, to) {
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
}

// Hand in the site: app/ whole, and screenshots/ when the maker has taken them.
mkdirSync(outDir, { recursive: true });
copyTree(join(repoRoot, 'app'), join(outDir, 'app'));
const shotsDir = join(repoRoot, 'screenshots');
if (existsSync(shotsDir)) copyTree(shotsDir, join(outDir, 'screenshots'));

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in
// app/ or 16 MiB of app files: app/ counts beside /output's own 1000-entry
// cap, its screenshots/ and dossier.json).
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
