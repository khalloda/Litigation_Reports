SELECT الدعاوى.[رقم الطعن], الدعاوى.[سنة الطعن], الدعاوى.[اسم الطاعن], الدعاوى.[اسم المطعون ضده], الدعاوى.[matterDegree], الدعاوى.[matterCategory], الدعاوى.[matterSelect]
FROM الدعاوى
WHERE (((الدعاوى.[رقم الطعن])<>"") And ((الدعاوى.[matterDegree])="نقض") And ((الدعاوى.[matterCategory])="جنح" Or (الدعاوى.[matterCategory])="جنايات") And ((الدعاوى.[matterSelect])=Yes));
