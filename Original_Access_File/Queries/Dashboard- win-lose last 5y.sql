TRANSFORM Count(الجلسات.[رقم الدعوى]) AS [CountOfرقم الدعوى]
SELECT الجلسات.التاريخ
FROM الجلسات
WHERE (((الجلسات.[صالح/ضد]) Is Not Null))
GROUP BY الجلسات.التاريخ
PIVOT الجلسات.[صالح/ضد];
