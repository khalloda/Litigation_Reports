SELECT الدعاوى.محامي, الدعاوى.العميل, الدعاوى.[matterAR], الدعاوى.[client&Cap], الدعاوى.[opponent&Cap], الدعاوى.[matterSubject], الجلسات.المحكمة, الجلسات.الدائرة, الجلسات.التاريخ, الجلسات.القرار, الدعاوى.[matterPartner], الدعاوى.[matterNotes2], الدعاوى.[matterCategory], الدعاوى.[matterImportance], الدعاوى.[matterDegree]
FROM الدعاوى INNER JOIN الجلسات ON الدعاوى.[matterAR]=الجلسات.[رقم الدعوى]
WHERE (((الدعاوى.محامي) Like "*" & Forms!التقارير!Combo75 & "*") And ((الجلسات.القرار)<>"") And ((الدعاوى.[matterSelect])=Yes) And ((الجلسات.تقرير)=Yes) And ((الدعاوى.[matterStatus])="سارية"));
