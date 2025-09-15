SELECT العملاء.العميل, [خطابات الأتعاب].[Cont-Date], [خطابات الأتعاب].[Cont-Details], [خطابات الأتعاب].[Cont-Structure], الفواتير.[Inv-Date], الفواتير.Amount, الفواتير.[Currency], الفواتير.[Inv-Details]
FROM العملاء INNER JOIN ([خطابات الأتعاب] INNER JOIN الفواتير ON [خطابات الأتعاب].[mfilesID]=الفواتير.[Cont-No]) ON العملاء.العميل=[خطابات الأتعاب].Client
WHERE (((الفواتير.[Inv-Status])="later"))
ORDER BY الفواتير.[Inv-Date];
