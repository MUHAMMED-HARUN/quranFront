import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress, Typography, Box } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { TestResultDetailDto, EvaluationLevel } from '../types/testResultDetail.types';

interface TestResultDetailTableProps {
    results: TestResultDetailDto[];
    isLoading: boolean;
    onEdit: (result: TestResultDetailDto) => void;
    onDelete: (id: string) => void;
}

export const TestResultDetailTable: React.FC<TestResultDetailTableProps> = ({ results, isLoading, onEdit, onDelete }) => {
    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (!results?.length) {
        return (
            <Typography align="center" color="textSecondary" p={4}>
                لا يوجد نتائج اختبار مسجلة
            </Typography>
        );
    }

    const getEvaluationText = (level?: EvaluationLevel) => {
        switch (level) {
            case EvaluationLevel.Excellent: return 'ممتاز';
            case EvaluationLevel.VeryGood: return 'جيد جداً';
            case EvaluationLevel.Good: return 'جيد';
            case EvaluationLevel.Weak: return 'ضعيف';
            case EvaluationLevel.VeryWeak: return 'ضعيف جداً';
            default: return 'غير محدد';
        }
    };

    return (
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
            <Table>
                <TableHead sx={{ backgroundColor: 'primary.light' }}>
                    <TableRow>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>رقم الجلسة</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>رقم عنصر المنهج</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>الدرجة</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>مستوى التقييم</TableCell>
                        <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>الإجراءات</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {results.map((row) => (
                        <TableRow key={row.Id} hover>
                            <TableCell>{row.TestSessionID}</TableCell>
                            <TableCell>{row.ScopeExecutionDetailID}</TableCell>
                            <TableCell>{row.Score ?? 'بدون'}</TableCell>
                            <TableCell>{getEvaluationText(row.EvaluationLevel)}</TableCell>
                            <TableCell align="center">
                                <IconButton onClick={() => onEdit(row)} color="primary" size="small">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => onDelete(row.Id)} color="error" size="small">
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
