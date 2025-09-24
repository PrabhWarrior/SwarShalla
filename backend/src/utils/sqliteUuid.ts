export const SQLITE_UUID_DEFAULT = `(
  lower(
    hex(randomblob(4)) || '-' ||
    hex(randomblob(2)) || '-4' ||
    substr(hex(randomblob(2)),2) || '-' ||
    substr('89AB', 1 + (abs(random()) % 4), 1) ||
    substr(hex(randomblob(2)),2) || '-' ||
    hex(randomblob(6))
  )
)`;