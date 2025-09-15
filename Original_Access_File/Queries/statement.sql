SELECT العملاء.Client_en, السداد.التاريخ, السداد.[العملة], السداد.Debit, السداد.Credit, السداد.[بيان السداد], الفواتير.[Inv-No]
FROM العملاء INNER JOIN (([خطابات الأتعاب] INNER JOIN الفواتير ON [خطابات الأتعاب].[mfilesID]=الفواتير.[Cont-No]) INNER JOIN السداد ON الفواتير.[Inv-No]=السداد.[رقم الفاتورة]) ON العملاء.العميل=[خطابات الأتعاب].[Client]
WHERE (((العملاء.Client_en)=[Forms]![التقارير]![Combo118]))
ORDER BY السداد.التاريخ;
