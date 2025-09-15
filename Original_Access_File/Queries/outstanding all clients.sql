SELECT العملاء.Client_en, الفواتير.[Inv-No], الفواتير.[Inv-Date], الفواتير.[Amount], الفواتير.[Currency], الفواتير.[Inv-Status], [invoice balance].Balance, الفواتير.[Inv-Details]
FROM العملاء INNER JOIN (([خطابات الأتعاب] INNER JOIN الفواتير ON [خطابات الأتعاب].[mfilesID]=الفواتير.[Cont-No]) INNER JOIN [invoice balance] ON الفواتير.[Inv-No]=[invoice balance].[رقم الفاتورة]) ON العملاء.العميل=[خطابات الأتعاب].[Client]
WHERE (((الفواتير.[Inv-Status])="Partially Paid" Or (الفواتير.[Inv-Status])="unpaid") And ((العملاء.Status)="Active"));
