SELECT First(التوكيلات.العميل) AS العميل, Count(التوكيلات.العميل) AS NumberOfDups
FROM التوكيلات
GROUP BY التوكيلات.العميل
HAVING (((Count(التوكيلات.العميل))>=1));
