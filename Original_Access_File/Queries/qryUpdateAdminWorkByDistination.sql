SELECT الدعاوى.matterAR, [admin work table].الجهة, [admin work table].المحكمة, [admin work table].[العمل المطلوب], [admin work table].الحالة, [admin work table].ID_Task, [admin work table].الحالة, [admin work table].الدائرة
FROM الدعاوى INNER JOIN [admin work table] ON الدعاوى.matterID=[admin work table].matterID
WHERE ((([admin work table].الجهة)=Forms!Dashboard!combo555) And (([admin work table].الحالة)<>"منجزة"));
