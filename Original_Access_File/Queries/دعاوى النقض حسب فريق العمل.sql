SELECT [فريق العمل].Code, الدعاوى.[matterDegree]
FROM [فريق العمل] INNER JOIN الدعاوى ON [فريق العمل].ID=الدعاوى.[فريق العمل]
WHERE (((الدعاوى.[matterStatus])="سارية") And ((الدعاوى.[matterDegree])="نقض"));
