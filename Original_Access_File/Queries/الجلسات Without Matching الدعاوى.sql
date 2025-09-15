SELECT الجلسات.[ID_hearings], الجلسات.[رقم الدعوى]
FROM الجلسات LEFT JOIN الدعاوى ON الجلسات.[رقم الدعوى]=الدعاوى.[matterAR]
WHERE (((الدعاوى.[matterAR]) Is Null));
