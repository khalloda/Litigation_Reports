SELECT الدعاوى.[matterAR], الدعاوى.[lawyerA]
FROM [فريق العمل] INNER JOIN (الدعاوى INNER JOIN الجلسات ON الدعاوى.[matterAR]=الجلسات.[رقم الدعوى]) ON [فريق العمل].ID = الدعاوى.[فريق العمل]
WHERE (((الدعاوى.[matterSelect])=Yes) And ((الجلسات.تقرير)=Yes) And ((الدعاوى.[matterStatus])="سارية"));
