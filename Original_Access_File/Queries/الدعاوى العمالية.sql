SELECT الدعاوى.[matterAR], الدعاوى.[matterStatus], الدعاوى.[matterCategory], الدعاوى.[matterDegree]
FROM الدعاوى
WHERE (((الدعاوى.[matterCategory])="عمال") And ((الدعاوى.[matterSubject])<>"مطالبة بالأرباح السنوية"));
