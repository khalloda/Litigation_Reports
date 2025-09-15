SELECT الفواتير.[Inv-No], الفواتير.[Inv-Date], الفواتير.Amount, الفواتير.[Currency], الفواتير.[Inv-Details], الفواتير.[Inv-Status], الفواتير.[Inv-Type], السداد.التاريخ, السداد.Credit, السداد.العملة, الفواتير.[VAT?]
FROM الفواتير INNER JOIN السداد ON الفواتير.[Inv-No]=السداد.[رقم الفاتورة]
WHERE (((الفواتير.[Inv-Type])="service") AND ((الفواتير.[VAT?])=Yes));
