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
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon, CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { useDailyTrackingsQuery, useDeleteDailyTrackingMutation } from "../hooks/useDailyTrackings";
import { useStudentAssessmentsQuery } from "../../studentAssessments/hooks/useStudentAssessments";
import { useDailyTrackingStore } from "../store/dailyTrackingStore";

export const DailyTrackingTable = ({ onOpenForm, onOpenView }: { onOpenForm: (item: any) => void; onOpenView: (item: any) => void }) => {
    const { data: response, isLoading } = useDailyTrackingsQuery();
    const { data: assessmentsResponse } = useStudentAssessmentsQuery();
    const deleteMutation = useDeleteDailyTrackingMutation();
    const { selectedIds, setSelectedIds } = useDailyTrackingStore();

    if (isLoading) return <Typography>جاري التحميل...</Typography>;

    const items = Array.isArray(response) ? response : ((response as any)?.Value || []);
    const studentAssessments = Array.isArray(assessmentsResponse) ? assessmentsResponse : ((assessmentsResponse as any)?.Value || []);

    const hasAssessment = (studentId: string) => {
        return studentAssessments.some((sa: any) => sa.StudentID === studentId);
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedIds(items.map((s: any) => s.Id || s.ID));
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

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={selectedIds.length > 0 && selectedIds.length < items.length}
                                checked={items.length > 0 && selectedIds.length === items.length}
                                onChange={handleSelectAll}
                            />
                        </TableCell>
                        <TableCell>المقرر</TableCell>
                        <TableCell>الطالب</TableCell>
                        <TableCell>الوحدة الحالية</TableCell>
                        <TableCell>إجمالي الوحدات</TableCell>
                        <TableCell>إجراءات</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item: any) => {
                        const id = item.Id || item.ID;
                        const isSelected = selectedIds.includes(id);
                        return (
                            <TableRow key={id} selected={isSelected}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isSelected}
                                        onChange={() => handleSelect(id)}
                                    />
                                </TableCell>
                                <TableCell>{item.SubjectID}</TableCell> {/* Should display actual name dynamically */}
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        {item.StudentID}
                                        {hasAssessment(item.StudentID) ? (
                                            <CheckCircleIcon color="success" fontSize="small" titleAccess="الطالب مقيم" />
                                        ) : (
                                            <CancelIcon color="error" fontSize="small" titleAccess="الطالب غير مقيم" />
                                        )}
                                    </Box>
                                </TableCell>
                                <TableCell>{item.CurrentUnit}</TableCell>
                                <TableCell>{item.TotalScopeUnit}</TableCell>
                                <TableCell>
                                    <Box display="flex" gap={1}>
                                        <IconButton color="info" onClick={() => onOpenView(item)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton color="primary" onClick={() => onOpenForm(item)}>
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
                    {items.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                لا توجد تقييمات يومية
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
