SELECT الدعاوى.[matterAR], الدعاوى.[client&Cap], الدعاوى.[opponent&Cap], الدعاوى.[matterSubject], الجلسات.التاريخ, الدعاوى.[lawyerA], الجلسات.القرار
FROM الدعاوى INNER JOIN الجلسات ON الدعاوى.[matterAR]=الجلسات.[رقم الدعوى]
WHERE (((الجلسات.التاريخ)>#1/10/2019#) And ((الجلسات.القرار) Is Not Null) And ((الجلسات.[إخطار العميل بالقرار])=No) And ((الدعاوى.[matterStatus])="سارية"));
