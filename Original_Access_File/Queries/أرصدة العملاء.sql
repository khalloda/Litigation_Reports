SELECT العملاء.Client_en, Sum(السداد.Debit) AS SumOfDebit, Sum(السداد.Credit) AS SumOfCredit, السداد.العملة, Sum([Credit]-[Debit]) AS Balance
FROM العملاء INNER JOIN (([خطابات الأتعاب] INNER JOIN الفواتير ON [خطابات الأتعاب].[mfilesID]=الفواتير.[Cont-No]) INNER JOIN السداد ON الفواتير.[Inv-No]=السداد.[رقم الفاتورة]) ON العملاء.العميل=[خطابات الأتعاب].Client
GROUP BY العملاء.Client_en, السداد.العملة;
