SELECT [admin work table].الجهة, [admin work table].المحكمة, [admin work table].الدائرة, الدعاوى.[matterAR], الدعاوى.[client&Cap], الدعاوى.[opponent&Cap], [admin work table].[آخر متابعة], [admin work table].[القرار السابق], [admin work table].[العمل المطلوب], [admin work table].تقرير, الدعاوى.العميل
FROM الدعاوى INNER JOIN [admin work table] ON الدعاوى.[matterAR]=[admin work table].[رقم الدعوى]
WHERE ((([admin work table].تقرير)=Yes) And ((الدعاوى.العميل)=Forms!التقارير!Combo46));
