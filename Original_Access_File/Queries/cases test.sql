SELECT الدعاوى.العميل, الدعاوى.[matterAR], الدعاوى.[client&Cap], الدعاوى.[opponent&Cap], الدعاوى.[matterSubject], الدعاوى.[matterStatus], الدعاوى.[matterCategory], الدعاوى.[matterDegree], الدعاوى.[matterImportance], الدعاوى.[matterPartner], العملاء.logo.FileData, الدعاوى.محامي, الدعاوى.[lawyerA]
FROM العملاء INNER JOIN الدعاوى ON العملاء.العميل=الدعاوى.العميل
WHERE (((الدعاوى.[matterAR])=Forms!Dashboard![subfrmMatters].Form![matterAR]));
