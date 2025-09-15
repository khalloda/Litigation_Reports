SELECT [admin work table].الجهة, [admin work table].المحكمة, [admin work table].الدائرة, الدعاوى.[matterAR], الدعاوى.[client&Cap], الدعاوى.[opponent&Cap], [admin work table].[العمل المطلوب], [admin work table].[آخر متابعة], [admin work table].[القرار السابق]
FROM الدعاوى INNER JOIN [admin work table] ON الدعاوى.[matterAR]=[admin work table].[رقم الدعوى]
WHERE ((([admin work table].الجهة)=[Forms]![Dashboard]![التقارير].[Form]![الجهة]));
