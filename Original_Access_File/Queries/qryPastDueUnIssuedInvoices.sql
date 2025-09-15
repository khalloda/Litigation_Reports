SELECT الفواتير.[Inv-Status], الفواتير.[Inv-No], الفواتير.[Inv-Date], العملاء.العميل, [خطابات الأتعاب].[Cont-Type], [خطابات الأتعاب].[Cont-Date], [خطابات الأتعاب].[Cont-Details], العملاء.Client_en, الفواتير.[Inv-Details], الفواتير.Amount, الفواتير.Currency
FROM (العملاء INNER JOIN [خطابات الأتعاب] ON العملاء.ID_client=[خطابات الأتعاب].clientID) INNER JOIN الفواتير ON [خطابات الأتعاب].contractID=الفواتير.contractID
WHERE (((الفواتير.[Inv-Status])="later") AND ((الفواتير.[Inv-Date])<=Date()));
