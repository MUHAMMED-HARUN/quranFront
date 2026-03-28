import React, { useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Tooltip,
    Typography,
    Box,
    CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { EnrollStudentInScopeExecutionDetail, EnrollmentStatus } from '../types/enrollStudentInScopeExecutionDetail.types';

interface EnrollStudentInScopeExecutionDetailTableProps {
    data: EnrollStudentInScopeExecutionDetail[];
    isLoading: boolean;
    onEdit: (item: EnrollStudentInScopeExecutionDetail) => void;
    onDelete: (id: string) => void;
}

const getStatusColor = (status: EnrollmentStatus) => {
    switch (status) {
        case EnrollmentStatus.Completed: return 'success';
        case EnrollmentStatus.Enrolled: return 'primary';
        case EnrollmentStatus.Withdrawn: return 'error';
        case EnrollmentStatus.Transferred: return 'warning';
        default: return 'default';
    }
};

const getStatusLabel = (status: EnrollmentStatus) => {
    switch (status) {
        case EnrollmentStatus.Completed: return 'تم الإنجاز';
        case EnrollmentStatus.Enrolled: return 'مسجل';
        case EnrollmentStatus.Withdrawn: return 'منسحب';
        case EnrollmentStatus.Transferred: return 'منقول';
        default: return 'غير معروف';
    }
};

export const EnrollStudentInScopeExecutionDetailTable: React.FC<EnrollStudentInScopeExecutionDetailTableProps> = ({
    data,
    isLoading,
    onEdit,
    onDelete
}) => {
    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center', mt: 2, borderRadius: 2 }}>
                <Typography variant="h6" color="text.secondary">
                    لا يوجد أي طلاب مسجلين في هذا النطاق التفصيلي حالياً.
                </Typography>
            </Paper>
        );
    }

    return (
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, mt: 3, overflow: 'hidden' }}>
            <Table sx={{ minWidth: 650 }} aria-label="enrollments table">
                <TableHead sx={{ bgcolor: 'primary.light' }}>
                    <TableRow>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>اسم الطالب</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>تاريخ التسجيل</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>الحالة</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>تاريخ البدء</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>تاريخ الانتهاء</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ملاحظات</TableCell>
                        <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>إجراءات</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow
                            key={row.Id}
                            sx={{
                                '&:last-child td, &:last-child th': { border: 0 },
                                '&:hover': { bgcolor: 'action.hover' }
                            }}
                        >
                            <TableCell sx={{ fontWeight: 500 }}>{row.StudentName || row.StudentID}</TableCell>
                            <TableCell>{row.EnrollmentDate}</TableCell>
                            <TableCell>
                                <Chip
                                    label={getStatusLabel(row.Status)}
                                    color={getStatusColor(row.Status)}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontWeight: 'bold' }}
                                />
                            </TableCell>
                            <TableCell>{row.StartDate || '-'}</TableCell>
                            <TableCell>{row.CompletionDate || '-'}</TableCell>
                            <TableCell sx={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                <Tooltip title={row.Notes || ''} placement="top">
                                    <span>{row.Notes || '-'}</span>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="center">
                                <Tooltip title="تعديل التسجيل">
                                    <IconButton color="primary" onClick={() => onEdit(row)}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="حذف التسجيل">
                                    <IconButton color="error" onClick={() => onDelete(row.Id)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
