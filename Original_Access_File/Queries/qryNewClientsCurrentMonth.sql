SELECT Count(الدعاوى.matterID) AS CountOfmatterID
FROM الدعاوى
GROUP BY Year([matterstartdate]), Month([matterStartDate])
HAVING (((Year([matterstartdate]))=Year(Date())) AND ((Month([matterStartDate]))=Month(Date())));
