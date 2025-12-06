SELECT page_num, content
FROM READERS
WHERE doc_id = $1 AND page_num >= $2 AND page_num <= $3
ORDER_BY page_num
