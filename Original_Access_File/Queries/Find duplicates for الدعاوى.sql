SELECT First(الدعاوى.العميل) AS [العميل Field], Count(الدعاوى.العميل) AS NumberOfDups
FROM الدعاوى
GROUP BY الدعاوى.العميل
HAVING (((Count(الدعاوى.العميل))>1));
