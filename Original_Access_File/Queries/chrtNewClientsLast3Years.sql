SELECT الدعاوى.clientID, Min(الدعاوى.[matterStartDate]) AS [MinOfتاريخ الإنشاء], العملاء.العميل, العملاء.[Cash/probono]
FROM العملاء INNER JOIN الدعاوى ON العملاء.ID_client = الدعاوى.clientID
GROUP BY الدعاوى.clientID, العملاء.العميل, العملاء.[Cash/probono];
