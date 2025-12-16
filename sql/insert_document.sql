INSERT INTO DOCUMENTS (title, file_path, file_size, file_type, page_count) VALUES ($1, $2, $3, $4, $5)
RETURNING doc_id;