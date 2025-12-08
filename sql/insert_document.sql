INSERT INTO DOCUMENTS (title, page_count) VALUES ($1, $2)

RETURNING doc_id