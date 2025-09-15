SELECT العملاء.العميل, [خطابات الأتعاب].[mfilesID], [خطابات الأتعاب].[Cont-Type], [خطابات الأتعاب].[Cont-Date], [خطابات الأتعاب].[Cont-Details], [خطابات الأتعاب].[Cont-Structure], الدعاوى.[matterAR], الدعاوى.[matterStatus]
FROM العملاء INNER JOIN (الدعاوى INNER JOIN [خطابات الأتعاب] ON الدعاوى.[matterAR]=[خطابات الأتعاب].Matter.Value) ON العملاء.العميل = [خطابات الأتعاب].Client
WHERE (((الدعاوى.[matterStatus])="سارية"));
