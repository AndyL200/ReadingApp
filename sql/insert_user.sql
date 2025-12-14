INSERT INTO users (email, username, password_hash ) VALUES (
    $1,
    $2,
    crypt($3, gen_salt('bf', 10))
)
RETURNING user_id;