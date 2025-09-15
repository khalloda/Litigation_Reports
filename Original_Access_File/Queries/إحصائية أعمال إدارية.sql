SELECT [admin work table].الجهة, [admin work table].[القائم بالعمل], [admin work table].[تاريخ التنفيذ], [admin work table].النتيجة
FROM [admin work table]
WHERE ((([admin work table].[القائم بالعمل])="سامي خطاب" Or ([admin work table].[القائم بالعمل])="محمود علي" Or ([admin work table].[القائم بالعمل])="محمود شعبان") AND (([admin work table].[تاريخ التنفيذ]) Between #7/1/2019# And #9/30/2019#))
ORDER BY [admin work table].الجهة;
