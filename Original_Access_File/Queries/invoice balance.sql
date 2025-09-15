SELECT الفواتير.[Inv-No], Sum(السداد.Credit) AS SumOfCredit, Sum(السداد.Debit) AS SumOfDebit, Sum([Credit]-[Debit]) AS Balance
FROM الفواتير INNER JOIN السداد ON الفواتير.[Inv-No]=السداد.[رقم الفاتورة]
GROUP BY الفواتير.[Inv-No];
