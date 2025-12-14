INSERT INTO JWT_KEYS (user_id, token_hash, expires_at) VALUES (
    $1,
    crypt($2, gen_salt('bf', 10)),
    $3
);