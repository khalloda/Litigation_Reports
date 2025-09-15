TRANSFORM Count(الدعاوى.[matterAR]) AS [CountOfرقم الدعوى]
SELECT الدعاوى.[matterCategory]
FROM الدعاوى
WHERE (((الدعاوى.[matterStatus])="سارية"))
GROUP BY الدعاوى.[matterStatus], الدعاوى.[matterCategory]
ORDER BY الدعاوى.[matterCategory]
PIVOT الدعاوى.[matterDegree];
