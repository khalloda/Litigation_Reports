SELECT Count(الدعاوى.[matterAR]) AS [CountOfرقم الدعوى], الدعاوى.[matterStatus], الدعاوى.[matterCategory], [فريق العمل].Code
FROM [فريق العمل] INNER JOIN الدعاوى ON [فريق العمل].ID = الدعاوى.[فريق العمل]
GROUP BY الدعاوى.[matterStatus], الدعاوى.[matterCategory], الدعاوى.[matterSelect], [فريق العمل].Code
HAVING (((الدعاوى.[matterStatus])="سارية") And ((الدعاوى.[matterSelect])=Yes));
