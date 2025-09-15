SELECT DISTINCTROW First([admin work table].الجهة) AS [الجهة Field], Count([admin work table].الجهة) AS NumberOfDups
FROM [admin work table]
WHERE ((([admin work table].الحالة)<>"منجزة"))
GROUP BY [admin work table].الجهة
HAVING (((Count([admin work table].الجهة))>=1));
