import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { CompletionRecordDto, EvaluationLevel } from '../types/completionRecord.types';

interface CompletionRecordTableProps {
    records: CompletionRecordDto[];
    isLoading: boolean;
    onEdit: (record: CompletionRecordDto) => void;
    onDelete: (id: string) => void;
}

export const CompletionRecordTable: React.FC<CompletionRecordTableProps> = ({ records, isLoading, onEdit, onDelete }) => {
    if (isLoading) return <CircularProgress />;

    const getEvaluationLevelName = (type: EvaluationLevel) => {
        switch (type) {
            case EvaluationLevel.Excellent: return 'ممتاز';
            case EvaluationLevel.VeryGood: return 'جيد جداً';
            case EvaluationLevel.Good: return 'جيد';
            case EvaluationLevel.Acceptable: return 'مقبول';
            case EvaluationLevel.Weak: return 'ضعيف';
            default: return 'غير مقيم';
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>الطالب (معرف التسجيل)</TableCell>
                        <TableCell>التاريخ</TableCell>
                        <TableCell>التقدير اللفظي</TableCell>
                        <TableCell>الدرجة النهائية</TableCell>
                        <TableCell>إجراءات</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {records.map((record) => (
                        <TableRow key={record.Id}>
                            <TableCell>{record.StudentEnrollmentID.substring(0, 8)}...</TableCell>
                            <TableCell>{record.CompletionDate}</TableCell>
                            <TableCell>{getEvaluationLevelName(record.EvaluationLevel)}</TableCell>
                            <TableCell>{record.FinalScore || '---'}</TableCell>
                            <TableCell>
                                <IconButton color="primary" onClick={() => onEdit(record)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => onDelete(record.Id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    {records.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} align="center">لا توجد سجلات إتمام (شهادات)</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
