SELECT (token_hash, expires_at) FROM JWT_KEYS WHERE token_hash = $1 AND expires_at > NOW() LIMIT 1
