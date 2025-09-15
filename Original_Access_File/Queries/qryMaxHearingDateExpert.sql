SELECT الجلسات.التاريخ, الجلسات.matterID, الجلسات.القرار
FROM (qryMatterMaxHearingDate3 INNER JOIN الجلسات ON qryMatterMaxHearingDate3.MaxOfالتاريخ = الجلسات.التاريخ) INNER JOIN الدعاوى ON (الدعاوى.matterID = الجلسات.matterID) AND (qryMatterMaxHearingDate3.matterID = الدعاوى.matterID);
