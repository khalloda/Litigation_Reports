SELECT [admin work table].ID_Task, Max([إجراءات المهام].[تاريخ الإجراء]) AS [MaxOfتاريخ الإجراء]
FROM [admin work table] INNER JOIN [إجراءات المهام] ON [admin work table].ID_Task=[إجراءات المهام].ID_Task
GROUP BY [admin work table].ID_Task;
