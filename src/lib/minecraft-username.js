/** ZEDX uses Tebex "Geyser (Dot Prefix)" — Bedrock names often need a leading dot. */

export function sanitizeMinecraftUsername(raw) {
  return String(raw || "")
    .trim()
    .replace(/\s+/g, "");
}

export function getUsernameCandidates(raw) {
  const name = sanitizeMinecraftUsername(raw);
  if (!name) return [];

  const candidates = [];
  const add = (value) => {
    if (value && !candidates.includes(value)) candidates.push(value);
  };

  add(name);

  if (name.startsWith(".")) {
    add(name.slice(1));
  } else {
    add(`.${name}`);
  }

  return candidates;
}

export function isValidMinecraftUsernameFormat(raw) {
  const name = sanitizeMinecraftUsername(raw);
  if (name.length < 3 || name.length > 16) return false;
  return /^\.?[a-zA-Z0-9_]+$/.test(name);
}
