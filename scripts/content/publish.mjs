#!/usr/bin/env node
// Publishes reviewed articles: flips `status: "review"` to "published" and
// records who reviewed them and when.
//
//   npm run content:publish -- --reviewer "Full Name" kitchen-vastu griha-pravesh-puja
//   npm run content:publish -- --reviewer "Full Name" --all
//
// Run it only after a person has read each article against the checklist
// at /editorial-standards. The publish date is set to today unless
// --keep-date is passed.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DIR = path.join(ROOT, 'content/blog');

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  if (i === -1) return undefined;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const reviewer = flag('--reviewer');
const all = args.includes('--all');
const keepDate = args.includes('--keep-date');
const slugs = args.filter((a) => !a.startsWith('--'));

if (!reviewer) {
  console.error('Pass --reviewer "Full Name" (the person who reviewed the articles).');
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const targets = all
  ? fs.readdirSync(DIR).filter((f) => f.endsWith('.mdx') && /\nstatus: "review"/.test(fs.readFileSync(path.join(DIR, f), 'utf8'))).map((f) => f.slice(0, -4))
  : slugs;

if (!targets.length) {
  console.error('Nothing to publish. Pass article slugs or --all.');
  process.exit(1);
}

for (const slug of targets) {
  const file = path.join(DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) {
    console.error(`No such article: ${slug}`);
    process.exitCode = 1;
    continue;
  }
  let src = fs.readFileSync(file, 'utf8');
  if (!/\nstatus: "review"/.test(src)) {
    console.log(`skip ${slug}: not in review`);
    continue;
  }
  src = src.replace(/\nstatus: "review"/, `\nstatus: "published"\nreviewedBy: ${JSON.stringify(reviewer)}\nreviewedAt: "${today}"`);
  if (!keepDate) src = src.replace(/\ndate: "[^"]*"/, `\ndate: "${today}"`);
  fs.writeFileSync(file, src);
  console.log(`published ${slug}`);
}
console.log('\nNext: npm run content:check && npm run build, then commit.');
