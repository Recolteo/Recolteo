#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { resolve, extname, basename } from 'path';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

const SECRET_PATTERNS = [
  { name: 'OpenAI API Key',          pattern: /sk-[a-zA-Z0-9]{20,}/ },
  { name: 'AWS Access Key ID',       pattern: /AKIA[0-9A-Z]{16}/ },
  { name: 'AWS Secret Access Key',   pattern: /aws_secret_access_key\s*[=:]\s*['"]?[a-zA-Z0-9/+]{40}['"]?/ },
  { name: 'Stripe Secret Key (live)',pattern: /sk_live_[0-9a-zA-Z]{24,}/ },
  { name: 'Stripe Secret Key (test)',pattern: /sk_test_[0-9a-zA-Z]{24,}/ },
  { name: 'Supabase Service Key',    pattern: /sbp_[0-9a-fA-F]{36,}/ },
  { name: 'Supabase JWT Secret',     pattern: /SUPABASE_JWT_SECRET\s*[=:]\s*['"]?[a-zA-Z0-9+/]{30,}['"]?/ },
  { name: 'GitHub Token (PAT)',      pattern: /ghp_[a-zA-Z0-9]{36}/ },
  { name: 'GitHub OAuth Token',      pattern: /gho_[a-zA-Z0-9]{36}/ },
  { name: 'GitHub Actions Token',    pattern: /ghs_[a-zA-Z0-9]{36}/ },
  { name: 'Google API Key',          pattern: /AIza[0-9A-Za-z-_]{35}/ },
  { name: 'Firebase API Key',        pattern: /AAAA[A-Za-z0-9_-]{7}:[A-Za-z0-9_-]{140}/ },
  { name: 'Twilio Account SID',      pattern: /AC[a-z0-9]{32}/ },
  { name: 'SendGrid API Key',        pattern: /SG\.[a-zA-Z0-9-_]{22}\.[a-zA-Z0-9-_]{43}/ },
  { name: 'JWT Token',               pattern: /eyJ[A-Za-z0-9-_]{10,}\.[A-Za-z0-9-_]{10,}\.[A-Za-z0-9-_]{10,}/ },
  { name: 'RSA/SSH Private Key',     pattern: /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'Mot de passe hardcodé',   pattern: /password\s*[:=]\s*['"][^'"${\s]{8,}['"]/ },
  { name: 'Secret hardcodé',         pattern: /secret\s*[:=]\s*['"][^'"${\s]{8,}['"]/ },
  { name: 'Clé API hardcodée',       pattern: /api[_-]?key\s*[:=]\s*['"][^'"${\s]{8,}['"]/ },
  { name: 'Token hardcodé',          pattern: /token\s*[:=]\s*['"][^'"${\s]{16,}['"]/ },
  { name: 'Clé Stripe en dur',       pattern: /['"]pk_live_[0-9a-zA-Z]{20,}['"]/ },
];

const IGNORED_FILENAMES = new Set([
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
  'check-secrets.mjs',
]);

const IGNORED_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp',
  '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.mp4', '.mp3', '.wav', '.pdf',
  '.zip', '.tar', '.gz', '.7z',
  '.lock',
]);

function getFilesToScan() {
  // Try to get files changed vs main/master
  for (const branch of ['main', 'master']) {
    try {
      const base = execSync(`git merge-base HEAD ${branch}`, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      }).trim();
      const files = execSync(`git diff --name-only --diff-filter=ACM ${base} HEAD`, {
        encoding: 'utf-8',
      }).trim();
      if (files) return files.split('\n').filter(Boolean);
    } catch {}
  }

  // Fallback: files in last commit
  try {
    const files = execSync('git diff --name-only --diff-filter=ACM HEAD~1 HEAD', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    if (files) return files.split('\n').filter(Boolean);
  } catch {}

  // Final fallback: all tracked files
  try {
    return execSync('git ls-files', { encoding: 'utf-8' }).trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

const files = getFilesToScan();
let totalFound = 0;

console.log(`\n${YELLOW}[Sécurité] Scan de ${files.length} fichier(s)...${RESET}`);

for (const file of files) {
  const name = basename(file);
  const ext = extname(file).toLowerCase();

  if (IGNORED_FILENAMES.has(name)) continue;
  if (IGNORED_EXTENSIONS.has(ext)) continue;
  if (!existsSync(file)) continue;

  let content;
  try {
    content = readFileSync(resolve(file), 'utf-8');
  } catch {
    continue;
  }

  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Skip commented-out lines
    if (/^\s*(\/\/|#|\/\*)/.test(line)) continue;

    for (const { name: secretName, pattern } of SECRET_PATTERNS) {
      if (pattern.test(line)) {
        console.error(`\n${RED}❌ Secret détecté : ${secretName}${RESET}`);
        console.error(`   Fichier : ${file}:${i + 1}`);
        console.error(`   Ligne   : ${line.trim().substring(0, 100)}`);
        totalFound++;
      }
    }
  }
}

if (totalFound > 0) {
  console.error(`\n${RED}🚫 Push bloqué — ${totalFound} secret(s) détecté(s).${RESET}`);
  console.error(`${YELLOW}Conseil : utilisez des variables d'environnement (.env.local) et vérifiez votre .gitignore.${RESET}\n`);
  process.exit(1);
} else {
  console.log(`${GREEN}✅ Aucun secret détecté — push autorisé.\n${RESET}`);
  process.exit(0);
}
