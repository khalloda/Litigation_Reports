SELECT DISTINCT العملاء.العميل, [خطابات الأتعاب].[Cont-Details], الفواتير.[Inv-No], الفواتير.Amount, الفواتير.[Inv-Type], الفواتير.[Inv-Status], الدعاوى.[lawyerA]
FROM الدعاوى INNER JOIN ((العملاء INNER JOIN [خطابات الأتعاب] ON العملاء.العميل = [خطابات الأتعاب].Client) INNER JOIN الفواتير ON [خطابات الأتعاب].[mfilesID]=الفواتير.[Cont-No]) ON الدعاوى.[matterAR]=[خطابات الأتعاب].Matter.Value
WHERE (((الفواتير.[Inv-Status])<>"paid"));
