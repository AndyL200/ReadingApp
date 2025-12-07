BEGIN;

INSERT INTO DOCUMENTS (title, page_count) VALUES ('Sample Document', 1);

INSERT INTO READERS (doc_id, page_num, content) 
VALUES ((SELECT doc_id FROM DOCUMENTS WHERE title='Sample Document' LIMIT 1), 1, '{"page_num": 1, "text": "This is the content of page 1."}');

COMMIT;