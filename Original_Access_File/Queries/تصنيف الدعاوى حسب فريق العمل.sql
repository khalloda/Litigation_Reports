SELECT [فريق العمل].Code, الدعاوى.[matterCategory]
FROM [فريق العمل] INNER JOIN الدعاوى ON [فريق العمل].ID=الدعاوى.[فريق العمل]
WHERE (((الدعاوى.[matterStatus])="سارية"));
