SELECT الدعاوى.[matterAR], الدعاوى.[lawyerA], الدعاوى.التصنيف
FROM العملاء INNER JOIN ([فريق العمل] INNER JOIN (الدعاوى INNER JOIN الجلسات ON الدعاوى.[matterAR]=الجلسات.[رقم الدعوى]) ON [فريق العمل].ID = الدعاوى.[فريق العمل]) ON العملاء.العميل = الدعاوى.العميل
WHERE (((الدعاوى.[matterStatus])="سارية") And ((الجلسات.تقرير)=Yes));
