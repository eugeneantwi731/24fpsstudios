# Managing Admin & Editor Accounts

This document explains how to add, update, and remove admin/editor accounts for the
24fps Studios admin panel (`/admin`).

There is no signup form or self-service account creation in the app. Every account is
created manually by inserting a row directly into the `admin_users` table in Supabase.

## How login works (background)

- Accounts live in the `admin_users` table: `id`, `username`, `password_hash`, `role`, `created_at`, `created_by`.
- Passwords are **never stored in plain text**. `password_hash` holds a salted PBKDF2
  hash in the format `salt:hash` (see `src/lib/auth.ts`).
- `generate-hash.mjs` (project root) produces that exact format from a plain-text
  password, using the same algorithm the login route verifies against.
- `role` must be either `admin` or `editor` (enforced in `src/env.d.ts` typing — the
  app doesn't currently gate features differently between the two, but keep this in
  sync if/when it does).

Because of the hashing, **you cannot type a plain password directly into the
`password_hash` column** — it must be generated first.

## Adding a new admin or editor

1. **Generate a password hash.**

   From the project root, in a terminal:

   ```bash
   node generate-hash.mjs <the-password-you-want-for-this-person>
   ```

   Example:

   ```bash
   node generate-hash.mjs Str0ngP@ssword2026
   ```

   This prints a single line to the terminal, e.g.:

   ```
   0495e3bb9be7d6e22b7fb02b9bdb1bcb:157177193a621e23b63a1061cf797a5cd8b8bd7765daa241283074a6ad5981e6
   ```

   Copy that entire string (everything before *and* after the colon).

2. **Insert a new row in Supabase.**

   - Go to the [Supabase dashboard](https://supabase.com/dashboard) → your project → **Table Editor** → `admin_users`.
   - Click **Insert row**.
   - Fill in:
     | Column | Value |
     |---|---|
     | `username` | Their login username, lowercase (the app lowercases on login regardless, so match it) |
     | `password_hash` | Paste the full string generated in step 1 |
     | `role` | `admin` or `editor` |
     | `id` | Leave as auto-generated (uuid default) |
     | `created_at` | Leave as auto-generated (defaults to now) |
     | `created_by` | Optional — your own `admin_users.id`, or leave `NULL` |
   - Save the row.

3. **Give them their login username and the plain password** (the one you typed in
   step 1, not the generated hash) through a secure channel — not email/Slack in
   plain text if you can avoid it.

4. **Confirm** they can log in at `https://24fpsstudios.com/admin`.

## Changing an existing account's password

1. Generate a new hash for the new password:
   ```bash
   node generate-hash.mjs <their-new-password>
   ```
2. In Supabase → `admin_users`, find their row, click into the `password_hash`
   cell, and replace the value with the newly generated string.
3. Save. Their old password no longer works; the new one works immediately.

There's no "forgot password" flow in the app — resetting a password is always this
manual process for now.

## Removing an admin or editor

1. In Supabase → `admin_users`, delete their row.
2. Also delete any of their rows in `admin_sessions` (table: `admin_sessions`,
   filter by `admin_id`) so any existing logged-in session is invalidated
   immediately rather than expiring naturally after 24 hours.

## Notes / things to keep in mind

- **Never commit real passwords to git.** `generate-hash.mjs` takes the password as
  a command-line argument specifically so it's never saved in the file itself.
- **Session tokens expire 24 hours after login** (`login.ts` sets `expires_at` to
  `+24h`). There's currently no "remember me" or refresh mechanism.
- **`role` currently has no enforced permission differences** between `admin` and
  `editor` in the codebase — it's tracked but not yet used to restrict features. If
  you build editor-restricted views later, update this doc to describe the actual
  difference.
- If you ever need to check who has access, query `admin_users` directly in
  Supabase — there's no in-app user management screen yet.
