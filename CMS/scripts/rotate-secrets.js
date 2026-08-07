const fs = require("fs");
const crypto = require("crypto");

const b64 = (bytes) => crypto.randomBytes(bytes).toString("base64");

const newSecrets = {
  APP_KEYS: `${b64(32)},${b64(32)}`,
  API_TOKEN_SALT: b64(24),
  ADMIN_JWT_SECRET: b64(24),
  JWT_SECRET: b64(24),
  TRANSFER_TOKEN_SALT: b64(24),
  ENCRYPTION_KEY: b64(32),
};

const path = ".env";
const lines = fs.readFileSync(path, "utf8").split(/\r?\n/);
let changed = 0;

const out = lines.map((line) => {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=/);
  if (m && Object.prototype.hasOwnProperty.call(newSecrets, m[1])) {
    changed += 1;
    return `${m[1]}=${newSecrets[m[1]]}`;
  }
  return line;
});

fs.writeFileSync(path, out.join("\n"), "utf8");
console.log(`Replaced ${changed} secret lines.`);
