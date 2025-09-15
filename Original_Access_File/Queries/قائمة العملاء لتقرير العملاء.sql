SELECT First(الدعاوى.العميل) AS [العميل Field], Count(الدعاوى.العميل) AS NumberOfDups, العملاء.Status
FROM العملاء INNER JOIN الدعاوى ON العملاء.العميل=الدعاوى.العميل
GROUP BY الدعاوى.العميل, العملاء.Status
HAVING (((Count(الدعاوى.العميل))>=1) AND ((العملاء.Status)="Active"));
