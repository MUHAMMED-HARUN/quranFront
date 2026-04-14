import React from "react";
import { Card, CardContent, Typography, Grid, Divider, CircularProgress, Box } from "@mui/material";
import { useTestNominationsFilteredQuery } from "../hooks/useTestNominationsFilteredQuery";

interface Props {
  testNominationID: string;
}

export const TestNominationCard: React.FC<Props> = ({ testNominationID }) => {
  const { data, isLoading, isError } = useTestNominationsFilteredQuery(
    { TestNominationID: testNominationID },
    { enabled: !!testNominationID }
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }
  console.log(JSON.stringify(data));

  if (isError || !data || !data.Value || data.Value.length === 0) {
    alert("im hehe")
    return (
      <Card sx={{ bgcolor: "action.disabledBackground" }}>
        <CardContent>
          <Typography color="textSecondary" align="center">
            ???? - لم يتم العثور على بيانات
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const nomination = data.Value[0];
  const getStatusString = (status: number) => {
    switch (status) {
      case 1:
        return "قيد الانتظار";
      case 2:
        return "تم الاختبار";
      case 3:
        return "مرفوض";
      default:
        return "غير معروف";
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          معلومات الترشيح
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Box>
            <Typography variant="caption" color="textSecondary">
              اسم الطالب
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {nomination.StudentName}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">
              رقم الهوية
            </Typography>
            <Typography variant="body1">
              {nomination.NationalNumber || "-"}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">
              النطاق المستهدف
            </Typography>
            <Typography variant="body1">{nomination.TargetName}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">
              حالة الترشيح
            </Typography>
            <Typography
              variant="body1"
              color={
                nomination.NominationStatus === 2
                  ? "success.main"
                  : nomination.NominationStatus === 1
                    ? "warning.main"
                    : "error.main"
              }
              fontWeight="bold"
            >
              {getStatusString(nomination.NominationStatus)}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Typography variant="caption" color="textSecondary">
              الفترة المقترحة
            </Typography>
            <Typography variant="body1">
              {nomination.SuggestedDate
                ? new Date(nomination.SuggestedDate).toLocaleDateString("ar-SA")
                : "لم يتم التعيين بعد"}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
