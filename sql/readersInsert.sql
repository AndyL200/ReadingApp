BEGIN;

INSERT INTO DOCUMENTS (title) VALUES ('Sample Document');

INSERT INTO READERS (doc_id, page_num, content) 
VALUES (currval('documents_doc_id_seq'), 1, '{"page_num": 1, "text": "This is the content of page 1."}');

COMMIT;