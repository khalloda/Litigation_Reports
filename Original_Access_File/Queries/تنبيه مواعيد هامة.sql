SELECT [admin work table].[آخر موعد], الدعاوى.العميل, الدعاوى.[matterAR], [admin work table].[العمل المطلوب], [admin work table].المحكمة
FROM الدعاوى INNER JOIN [admin work table] ON الدعاوى.[matterAR]=[admin work table].[رقم الدعوى]
WHERE ((([admin work table].[آخر موعد])<=Date()+7) AND (([admin work table].تنبيه)=Yes));
