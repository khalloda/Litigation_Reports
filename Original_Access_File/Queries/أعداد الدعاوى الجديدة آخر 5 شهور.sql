SELECT TOP 5 Count(الدعاوى.ID_matters) AS CountOfID_matters, Month([تاريخ الإنشاء]) AS Expr1, Year([تاريخ الإنشاء]) AS Expr2
FROM الدعاوى
GROUP BY Month([تاريخ الإنشاء]), Year([تاريخ الإنشاء])
HAVING (((Year([تاريخ الإنشاء]))=2020))
ORDER BY Month([تاريخ الإنشاء]) DESC;
