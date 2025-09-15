SELECT TOP 5 العملاء.العميل, Count(الدعاوى.[matterAR]) AS [CountOfرقم الدعوى], الدعاوى.[matterStatus]
FROM العملاء INNER JOIN الدعاوى ON العملاء.[ID_client]=الدعاوى.clientID
GROUP BY العملاء.العميل, الدعاوى.[matterStatus]
HAVING (((الدعاوى.[matterStatus])="سارية"))
ORDER BY Count(الدعاوى.[matterAR]) DESC;
