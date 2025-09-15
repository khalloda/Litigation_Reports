SELECT Max(الجلسات.التاريخ) AS MaxOfالتاريخ, الجلسات.[رقم الدعوى] AS Expr1
FROM الجلسات
GROUP BY الجلسات.[رقم الدعوى];
