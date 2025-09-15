SELECT [admin work table].الجهة, [admin work table].المحكمة, [admin work table].الدائرة, الدعاوى.[matterAR], الدعاوى.[client&Cap], الدعاوى.[opponent&Cap], [admin work table].[العمل المطلوب], [admin work table].الحالة, [admin work table].[تاريخ الإنشاء], الجلسات.التاريخ, الجلسات.القرار, [إجراءات المهام].[تاريخ الإجراء], [إجراءات المهام].النتيجة
FROM ((الدعاوى INNER JOIN [admin work table] ON الدعاوى.[matterAR]=[admin work table].[رقم الدعوى]) INNER JOIN الجلسات ON الدعاوى.[matterAR]=الجلسات.[رقم الدعوى]) INNER JOIN [إجراءات المهام] ON [admin work table].ID_Task=[إجراءات المهام].ID_Task
WHERE ((([admin work table].الحالة)<>"منجزة") AND ((الجلسات.تقرير)=Yes) AND (([إجراءات المهام].تقرير)=Yes))
ORDER BY [admin work table].الجهة;
