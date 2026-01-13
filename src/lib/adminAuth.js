import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const ADMIN_SUPER_EMAIL = "admin@gmail.com";
export const ADMIN_SUPER_PASSWORD = "admin@26";
const ADMIN_DEFAULT_NAME = "Platform Admin";

function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export async function ensureAdminUser() {
  const email = ADMIN_SUPER_EMAIL.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });

  const hashedPassword = await bcrypt.hash(ADMIN_SUPER_PASSWORD, 10);

  if (!existing) {
    return prisma.user.create({
      data: {
        name: ADMIN_DEFAULT_NAME,
        email,
        role: "ADMIN",
        password: hashedPassword,
      },
    });
  }

  const hasValidPassword = existing.password
    ? await bcrypt.compare(ADMIN_SUPER_PASSWORD, existing.password)
    : false;

  const requiresUpdate =
    existing.role !== "ADMIN" || !hasValidPassword;

  if (requiresUpdate) {
    return prisma.user.update({
      where: { id: existing.id },
      data: {
        role: "ADMIN",
        name: existing.name || ADMIN_DEFAULT_NAME,
        password: hashedPassword,
      },
    });
  }

  return existing;
}

export async function verifyAdminCredentials(emailInput, passwordInput) {
  const email = normalizeEmail(emailInput);
  const password = typeof passwordInput === "string" ? passwordInput : "";

  if (!email || !password) {
    return null;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role !== "ADMIN" || !user.password) {
    return null;
  }

  const matches = await bcrypt.compare(password, user.password);
  return matches ? user : null;
}
