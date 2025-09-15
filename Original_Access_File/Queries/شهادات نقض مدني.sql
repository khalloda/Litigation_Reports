SELECT الدعاوى.[رقم الطعن], الدعاوى.[سنة الطعن], الدعاوى.[اسم الطاعن], الدعاوى.[اسم المطعون ضده], الدعاوى.[matterDegree], الدعاوى.[matterCategory], الدعاوى.[matterSelect], الدعاوى.[matterShelf], الدعاوى.العميل, الجلسات.تقرير, الجلسات.التاريخ, الجلسات.القرار
FROM الدعاوى INNER JOIN الجلسات ON الدعاوى.[matterAR]=الجلسات.[رقم الدعوى]
WHERE (((الدعاوى.[رقم الطعن])<>"") And ((الدعاوى.[matterDegree])="نقض") And ((الدعاوى.[matterCategory])="مدني" Or (الدعاوى.[matterCategory])="عمال") And ((الدعاوى.[matterSelect])=Yes) And ((الجلسات.تقرير)=Yes));
