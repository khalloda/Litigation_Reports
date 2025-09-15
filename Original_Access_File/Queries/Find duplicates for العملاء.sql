SELECT First(العملاء.[Client_en]) AS [Client_en Field], Count(العملاء.[Client_en]) AS NumberOfDups
FROM العملاء
GROUP BY العملاء.[Client_en]
HAVING (((Count(العملاء.[Client_en]))>1));
