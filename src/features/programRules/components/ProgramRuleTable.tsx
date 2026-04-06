import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ProgramRuleDto, ProgramRuleType, ComparisonType } from '../types/programRule.types';

interface ProgramRuleTableProps {
    rules: ProgramRuleDto[];
    isLoading: boolean;
    onEdit: (rule: ProgramRuleDto) => void;
    onDelete: (id: string) => void;
}

export const ProgramRuleTable: React.FC<ProgramRuleTableProps> = ({ rules, isLoading, onEdit, onDelete }) => {
    if (isLoading) return <CircularProgress />;

    const getRuleTypeName = (type: ProgramRuleType) => {
        switch (type) {
            case ProgramRuleType.SingleSubject: return 'مادة واحدة';
            case ProgramRuleType.TotalScore: return 'المجموع الكلي';
            case ProgramRuleType.AverageScore: return 'المعدل';
            case ProgramRuleType.AttendancePercentage: return 'نسبة الحضور';
            case ProgramRuleType.MaxAbsenceDays: return 'أقصى غياب';
            default: return 'غير معروف';
        }
    };

    const getComparisonTypeName = (type: ComparisonType) => {
        switch (type) {
            case ComparisonType.GreaterThanOrEqual: return 'أكبر أو يساوي';
            case ComparisonType.Equal: return 'يساوي';
            case ComparisonType.LessThanOrEqual: return 'أصغر أو يساوي';
            case ComparisonType.GreaterThan: return 'أكبر من';
            case ComparisonType.LessThan: return 'أصغر من';
            default: return '';
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>نوع القاعدة</TableCell>
                        <TableCell>الشرط</TableCell>
                        <TableCell>القيمة المطلوبة</TableCell>
                        <TableCell>إلزامية؟</TableCell>
                        <TableCell>إجراءات</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rules.map((rule) => (
                        <TableRow key={rule.Id}>
                            <TableCell>{getRuleTypeName(rule.RuleType)}</TableCell>
                            <TableCell>{getComparisonTypeName(rule.ComparisonType)}</TableCell>
                            <TableCell>{rule.RequiredValue}</TableCell>
                            <TableCell>{rule.IsMandatory ? 'نعم' : 'لا'}</TableCell>
                            <TableCell>
                                <IconButton color="primary" onClick={() => onEdit(rule)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => onDelete(rule.Id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    {rules.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} align="center">لا توجد قواعد مضافة</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
