/** Floodgate / Geyser: Java = Steve, Bedrock = .Steve. Shop must send that exact name. */

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

/** Java = Steve, Bedrock = .Steve */
export function applyEditionPrefix(raw, edition) {
  let name = sanitizeMinecraftUsername(raw);
  if (!name) return "";
  if (name.startsWith(".")) name = name.slice(1);
  return edition === "bedrock" ? `.${name}` : name;
}

export function ignKey(raw) {
  return sanitizeMinecraftUsername(raw).replace(/^\./, "").toLowerCase();
}
