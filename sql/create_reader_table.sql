

CREATE TABLE IF NOT EXISTS DOCUMENTS (
    doc_id SERIAL PRIMARY KEY,
    title TEXT,
    file_path TEXT NOT NULL,
    file_size INT NOT NULL,
    file_type VARCHAR(25) DEFAULT 'pdf',
    page_count INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS READERS (
    doc_id INT REFERENCES DOCUMENTS(doc_id),
    page_num INT,
    width INT,
    height INT,
    PRIMARY KEY (doc_id, page_num)
);

SELECT * FROM DOCUMENTS;