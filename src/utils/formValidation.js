const SAFE_NAME_PATTERN = /^[A-Za-z0-9&()'.,\-\/ ]+$/;
export const TEXT_ONLY_PATTERN = /^[A-Za-z ]+$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89abAB][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const MOBILE_NUMBER_PATTERN = /^[6-9]\d{9}$/;
const DATA_URL_IMAGE_PATTERN = /^data:image\//i;
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".avif", ".heic"];

export const validationMessages = {
  required: (label = "Field") => `${label} is required`,
  minLength: (label, min) => `${label} must be at least ${min} characters`,
  maxLength: (label, max) => `${label} must be at most ${max} characters`,
  invalidChars: (label) => `${label} contains invalid characters`,
  invalidId: (label = "Identifier") => `${label} is invalid`,
  invalidMobile: (label = "Mobile number") => `${label} must be a valid 10-digit number`,
};

export function sanitizeTextInput(value, options = {}) {
  if (typeof value !== "string") {
    return "";
  }

  const { trim = true } = options;

  const normalized = value
    .normalize("NFKC")
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ");

  if (trim) {
    return normalized.trim();
  }

  // Keep trailing spaces so multi-word inputs don't feel blocked while typing.
  return normalized.replace(/^\s+/, "");
}

export function sanitizeTextOnlyInput(value) {
  const base = sanitizeTextInput(value, { trim: false });
  if (!base) {
    return "";
  }

  return base
    .replace(/[^A-Za-z ]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^\s+/, "");
}

export function sanitizeDigits(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value.replace(/\D+/g, "");
}

export function sanitizeIdentifier(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

export function validateUuid(value, label = "Identifier") {
  const sanitized = sanitizeIdentifier(value);
  if (!sanitized) {
    return { error: validationMessages.required(label) };
  }
  if (!UUID_PATTERN.test(sanitized)) {
    return { error: validationMessages.invalidId(label) };
  }
  return { value: sanitized };
}

export function validateMobileNumber(value, label = "Mobile number") {
  const sanitized = sanitizeDigits(value).slice(0, 10);
  if (!sanitized) {
    return { error: validationMessages.required(label) };
  }
  if (!MOBILE_NUMBER_PATTERN.test(sanitized)) {
    return { error: validationMessages.invalidMobile(label) };
  }
  return { value: sanitized };
}

export function validateNameField(value, options = {}) {
  const {
    label = "Name",
    minLength = 2,
    maxLength = 80,
    pattern = SAFE_NAME_PATTERN,
  } = options;

  const sanitized = sanitizeTextInput(value);

  if (!sanitized) {
    return { error: validationMessages.required(label) };
  }

  if (sanitized.length < minLength) {
    return { error: validationMessages.minLength(label, minLength) };
  }

  if (sanitized.length > maxLength) {
    return { error: validationMessages.maxLength(label, maxLength) };
  }

  if (pattern && !pattern.test(sanitized)) {
    return { error: validationMessages.invalidChars(label) };
  }

  return { value: sanitized };
}

export function sanitizeSelectValue(value) {
  return sanitizeIdentifier(value);
}

export function isValidUuid(value) {
  return UUID_PATTERN.test(value ?? "");
}

export function validateImageFiles(files, options = {}) {
  const {
    maxFiles = 5,
    maxFileSize = 5 * 1024 * 1024,
    allowedMimePrefixes = ["image/"],
    allowedExtensions = IMAGE_EXTENSIONS,
  } = options;

  if (!Array.isArray(files) || files.length === 0) {
    return { files: [], error: null };
  }

  const validated = [];
  for (const file of files) {
    if (!file || typeof file !== "object") {
      continue;
    }

    const mimeType = typeof file.type === "string" ? file.type : "";
    const size = typeof file.size === "number" ? file.size : 0;
    const fileName = typeof file.name === "string" ? file.name.toLowerCase() : "";

    const typeAllowed = allowedMimePrefixes.some((prefix) =>
      mimeType.toLowerCase().startsWith(prefix)
    );
    const extensionAllowed = allowedExtensions.some((extension) =>
      fileName.endsWith(extension)
    );

    if (!typeAllowed && !extensionAllowed) {
      return { files: [], error: "Only image files are allowed" };
    }

    if (size > maxFileSize) {
      return { files: [], error: "Image file is too large" };
    }

    validated.push(file);
    if (validated.length >= maxFiles) {
      break;
    }
  }

  return { files: validated, error: null };
}

export function sanitizeDataUrlImages(images, maxImages = 5) {
  if (!Array.isArray(images)) {
    return [];
  }

  return images
    .map((img) => (typeof img === "string" ? img.trim() : ""))
    .filter((img) => DATA_URL_IMAGE_PATTERN.test(img))
    .slice(0, maxImages);
}
