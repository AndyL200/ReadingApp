SELECT page_num, content
FROM READERS
WHERE doc_id = $1 AND page_num BETWEEN $2 AND $3
ORDER BY page_num
