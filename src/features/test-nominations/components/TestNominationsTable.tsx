import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { TestNominationsDTOInfo } from "../types/testNomination.types";

interface Props {
  data: TestNominationsDTOInfo[];
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
  onMakeTest: (id: string) => void;
  onSetSuggestedDate: (id: string, currentStatus: number) => void;
}

export const TestNominationsTable: React.FC<Props> = ({
  data,
  onUpdate,
  onDelete,
  onMakeTest,
  onSetSuggestedDate,
}) => {
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
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>رقم الهوية</TableCell>
            <TableCell>اسم الطالب</TableCell>
            <TableCell>النطاق</TableCell>
            <TableCell>المرشح من قبل</TableCell>
            <TableCell>تاريخ مقترح</TableCell>
            <TableCell>الحالة</TableCell>
            <TableCell>الإجراءات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                لا توجد بيانات ليتم عرضها
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.TestNominationID}>
                <TableCell>{row.NationalNumber}</TableCell>
                <TableCell>{row.StudentName}</TableCell>
                <TableCell>{row.TargetName}</TableCell>
                <TableCell>{row.NominatedByPersonName || "النظام"}</TableCell>
                <TableCell>
                  {row.SuggestedDate
                    ? new Date(row.SuggestedDate).toLocaleDateString("ar-SA")
                    : "-"}
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color={
                      row.NominationStatus === 2
                        ? "success.main"
                        : row.NominationStatus === 1
                        ? "warning.main"
                        : "error.main"
                    }
                  >
                    {getStatusString(row.NominationStatus)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => onUpdate(row.TestNominationID)}
                    >
                      تعديل
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => onDelete(row.TestNominationID)}
                    >
                      حذف
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      onClick={() => onMakeTest(row.TestNominationID)}
                      disabled={row.NominationStatus !== 1}
                    >
                      بدء الاختبار
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="info"
                      onClick={() => onSetSuggestedDate(row.TestNominationID, row.NominationStatus)}
                      disabled={row.NominationStatus !== 1}
                    >
                      تعيين موعد
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
