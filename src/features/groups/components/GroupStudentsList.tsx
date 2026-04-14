import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useStudentEnrollmentsByGroupIdQuery } from "../../studentEnrollments/hooks/useStudentEnrollmentsByGroupIdQuery";
import { StudentEnrollment } from "../../studentEnrollments/types/studentEnrollment.types";

import { Handshake, EditNote } from "@mui/icons-material";
import { DailyEvaluationForm } from "../../dailyEvaluations/components/DailyEvaluationForm";
import { TestNominationsForm } from "../../test-nominations/components/TestNominationsForm";

export const GroupStudentsList = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  const {
    data: enrollmentsRes,
    isLoading,
    error,
  } = useStudentEnrollmentsByGroupIdQuery(groupId || "");
  const enrollments: StudentEnrollment[] = Array.isArray(enrollmentsRes)
    ? enrollmentsRes
    : (enrollmentsRes as any)?.Value || [];

  const [isDailyEvaluationOpen, setIsDailyEvaluationOpen] = useState(false);
  const [selectedStudentForEval, setSelectedStudentForEval] =
    useState<StudentEnrollment | null>(null);

  const [isNominationOpen, setIsNominationOpen] = useState(false);
  const [selectedEnrollmentForNomination, setSelectedEnrollmentForNomination] =
    useState<StudentEnrollment | null>(null);

  const handleOpenDailyEval = (enrollment: StudentEnrollment) => {
    setSelectedStudentForEval(enrollment);
    setIsDailyEvaluationOpen(true);
  };

  const handleOpenNomination = (enrollment: StudentEnrollment) => {
    setSelectedEnrollmentForNomination(enrollment);
    setIsNominationOpen(true);
  };

  if (isLoading) return <CircularProgress />;
  if (error)
    return <Typography color="error">حدث خطأ أثناء جلب البيانات</Typography>;

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight="bold">
          طلاب المجموعة
        </Typography>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          عودة
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ width: "100%", overflow: "hidden", p: 2 }}
      >
        {!enrollments.length ? (
          <Alert severity="info">
            لا يوجد طلاب مسجلين في هذه المجموعة حالياً.
          </Alert>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>اسم الطالب</TableCell>
                <TableCell>رقم الهوية</TableCell>
                <TableCell>الحالة</TableCell>
                <TableCell>الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enrollments.map((enrollment) => {
                const canNominate =
                  enrollment.HasInProgressDetails &&
                  !enrollment.HasPendingOrApprovedNominations;
                return (
                  <TableRow
                    key={
                      enrollment.StudentEnrollmentID ||
                      (enrollment as any).studentEnrollmentId
                    }
                    hover
                  >
                    <TableCell>
                      {enrollment.StudentName ||
                        (enrollment as any).studentName}
                    </TableCell>
                    <TableCell>
                      {enrollment.NationalNumber ||
                        (enrollment as any).nationalNumber}
                    </TableCell>
                    <TableCell>
                      <Typography
                        color={
                          enrollment.IsActive !== undefined
                            ? enrollment.IsActive
                              ? "success.main"
                              : "error.main"
                            : (enrollment as any).isActive
                              ? "success.main"
                              : "error.main"
                        }
                        variant="body2"
                      >
                        {(
                          enrollment.IsActive !== undefined
                            ? enrollment.IsActive
                            : (enrollment as any).isActive
                        )
                          ? "مفعل"
                          : "غير مفعل"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                          startIcon={<EditNote />}
                          onClick={() => handleOpenDailyEval(enrollment)}
                          disabled={
                            !(enrollment.IsActive !== undefined
                              ? enrollment.IsActive
                              : (enrollment as any).isActive)
                          }
                        >
                          إضافة تسميع
                        </Button>

                        {canNominate && (
                          <Button
                            variant="contained"
                            size="small"
                            color="secondary"
                            startIcon={<Handshake />}
                            onClick={() => handleOpenNomination(enrollment)}
                          >
                            ترشيح للاختبار
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Daily Evaluation Form Modal - Passed with specific initial context */}
      {isDailyEvaluationOpen && groupId && selectedStudentForEval && (
        <DailyEvaluationForm
          isOpen={isDailyEvaluationOpen}
          onClose={() => setIsDailyEvaluationOpen(false)}
          studentId={
            selectedStudentForEval.StudentID ||
            (selectedStudentForEval as any).studentId
          }
          groupId={groupId}
          studentName={
            selectedStudentForEval.StudentName ||
            (selectedStudentForEval as any).studentName
          }
          groupName={
            selectedStudentForEval.GroupName ||
            (selectedStudentForEval as any).groupName
          }
          studentEnrollmentId={
            selectedStudentForEval.StudentEnrollmentID ||
            (selectedStudentForEval as any).studentEnrollmentId
          }
          nationalNumber={
            selectedStudentForEval.NationalNumber ||
            (selectedStudentForEval as any).nationalNumber
          }
        />
      )}

      {/* Test Nomination Form Modal */}
      {isNominationOpen && selectedEnrollmentForNomination && (
        <TestNominationsForm
          open={isNominationOpen}
          onClose={() => setIsNominationOpen(false)}
          groupId={groupId || ""}
          initialData={{
            StudentEnrollmentID:
              selectedEnrollmentForNomination.StudentEnrollmentID ||
              (selectedEnrollmentForNomination as any).studentEnrollmentId ||
              "",
            ScopeExecutionID: undefined,
            ScopeExecutionDetailID: undefined,
            NominationStatus: 1, // Pending status
            NominatedByPersonID: undefined,
            SuggestedDate: undefined,
          }}
          onSuccess={() => {
            setIsNominationOpen(false);
            setSelectedEnrollmentForNomination(null);
          }}
        />
      )}
    </Box>
  );
};
