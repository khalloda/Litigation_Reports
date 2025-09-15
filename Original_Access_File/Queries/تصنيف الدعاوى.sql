SELECT First(الدعاوى.[matterCategory]) AS [التصنيف Field], Count(الدعاوى.[matterCategory]) AS NumberOfDups, [فريق العمل].Code
FROM [فريق العمل] INNER JOIN الدعاوى ON [فريق العمل].ID=الدعاوى.[فريق العمل]
GROUP BY [فريق العمل].Code, الدعاوى.[matterCategory], الدعاوى.[matterStatus]
HAVING (((Count(الدعاوى.[matterCategory]))>1) And ((الدعاوى.[matterStatus])="سارية"));
