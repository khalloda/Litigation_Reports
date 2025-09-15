SELECT الدعاوى.[matterPartner], الدعاوى.العميل, الدعاوى.[matterAR], الدعاوى.[client&Cap], الدعاوى.[opponent&Cap], الدعاوى.[matterSubject], الجلسات.المحكمة, الجلسات.الدائرة, الجلسات.التاريخ, الجلسات.القرار, الدعاوى.المحامي
FROM الدعاوى INNER JOIN الجلسات ON الدعاوى.[matterAR]=الجلسات.[رقم الدعوى]
WHERE (((الدعاوى.[matterPartner])=Forms!التقارير!partner_list) And ((الجلسات.القرار)<>"") And ((الدعاوى.[matterSelect])=Yes) And ((الجلسات.تقرير)=Yes));
