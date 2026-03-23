import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Checkbox,
    Box,
    Typography,
    Chip,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from "@mui/icons-material";
import { useStudentAssessmentsQuery, useDeleteStudentAssessmentMutation } from "../hooks/useStudentAssessments";
import { useStudentAssessmentStore } from "../store/studentAssessmentStore";
import { StudentAssessmentStatus } from "../types/studentAssessment.types";

export const StudentAssessmentTable = ({ onOpenForm, onOpenView }: { onOpenForm: (item: any) => void; onOpenView: (item: any) => void }) => {
    const { data: response, isLoading } = useStudentAssessmentsQuery();
    const deleteMutation = useDeleteStudentAssessmentMutation();
    const { selectedIds, setSelectedIds } = useStudentAssessmentStore();

    if (isLoading) return <Typography>جاري التحميل...</Typography>;

    const assessments = Array.isArray(response) ? response : ((response as any)?.Value || []);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedIds(assessments.map((s: any) => s.Id || s.ID));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("هل أنت متأكد من حذف هذا التقييم؟")) {
            deleteMutation.mutate(id);
        }
    };

    const renderStatus = (status: StudentAssessmentStatus) => {
        switch (status) {
            case StudentAssessmentStatus.Attended: return <Chip label="حاضر" color="success" size="small" />;
            case StudentAssessmentStatus.Absent: return <Chip label="غائب" color="error" size="small" />;
            case StudentAssessmentStatus.Excused: return <Chip label="عذر" color="warning" size="small" />;
            default: return <Chip label="غير معروف" size="small" />;
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={selectedIds.length > 0 && selectedIds.length < assessments.length}
                                checked={assessments.length > 0 && selectedIds.length === assessments.length}
                                onChange={handleSelectAll}
                            />
                        </TableCell>
                        <TableCell>الطالب</TableCell>
                        <TableCell>نطاق التقييم</TableCell>
                        <TableCell>الدرجة</TableCell>
                        <TableCell>الحالة</TableCell>
                        <TableCell>إجراءات</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {assessments.map((ass: any) => {
                        const id = ass.Id || ass.ID;
                        const isSelected = selectedIds.includes(id);
                        return (
                            <TableRow key={id} selected={isSelected}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isSelected}
                                        onChange={() => handleSelect(id)}
                                    />
                                </TableCell>
                                <TableCell>{ass.StudentID}</TableCell> {/* Map dynamic name if needed */}
                                <TableCell>{ass.AssessmentScopeID}</TableCell> {/* Map dynamic name if needed */}
                                <TableCell sx={{ fontWeight: 'bold' }}>{ass.Score}</TableCell>
                                <TableCell>{renderStatus(ass.Status)}</TableCell>
                                <TableCell>
                                    <Box display="flex" gap={1}>
                                        <IconButton color="info" onClick={() => onOpenView(ass)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton color="primary" onClick={() => onOpenForm(ass)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    {assessments.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                لا توجد تقييمات للطلاب
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
