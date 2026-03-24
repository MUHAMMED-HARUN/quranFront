import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    CircularProgress,
    Alert
} from "@mui/material";
import { useDailyEvaluationsQuery } from "../hooks/useDailyEvaluations";
import { useDailyEvaluationStore } from "../store/dailyEvaluationStore";

export const DailyEvaluationTable = () => {
    const { data: response, isLoading, isError, error } = useDailyEvaluationsQuery();
    const { selectedIds, toggleSelection, selectAll, openCard } = useDailyEvaluationStore();

    if (isLoading) return <CircularProgress />;
    if (isError) return <Alert severity="error">{(error as Error).message}</Alert>;

    const evaluations = Array.isArray(response) ? response : ((response as any)?.Value || []);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            selectAll(evaluations.map((t: any) => t.Id || t.ID));
        } else {
            selectAll([]);
        }
    };

    const handleRowClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        toggleSelection(id);
        openCard();
    };

    const getLevelText = (level: number) => {
        switch (level) {
            case 0: return "ممتاز";
            case 1: return "جيد جدا";
            case 2: return "جيد";
            case 3: return "مقبول";
            case 4: return "ضعيف";
            default: return "-";
        }
    };

    return (
        <TableContainer component={Paper} elevation={2} sx={{ mt: 3 }}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={selectedIds.length > 0 && selectedIds.length < evaluations.length}
                                checked={evaluations.length > 0 && selectedIds.length === evaluations.length}
                                onChange={handleSelectAll}
                            />
                        </TableCell>
                        <TableCell>التاريخ</TableCell>
                        <TableCell>اسم الطالب</TableCell>
                        <TableCell>رقم الهوية</TableCell>
                        <TableCell>اسم المجموعة</TableCell>
                        <TableCell>المادة</TableCell>
                        <TableCell>نوع الوحدة</TableCell>
                        <TableCell>النطاق (من-إلى)</TableCell>
                        <TableCell>المستوى</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {evaluations.map((evalItem: any) => {
                        const id = evalItem.Id || evalItem.ID;
                        const isSelected = selectedIds.includes(id);
                        return (
                            <TableRow
                                key={id}
                                hover
                                onClick={(e) => handleRowClick(id, e)}
                                selected={isSelected}
                                sx={{ cursor: "pointer" }}
                            >
                                <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                        checked={isSelected}
                                        onChange={() => toggleSelection(id)}
                                    />
                                </TableCell>
                                <TableCell>{evalItem.Date ? evalItem.Date.split("T")[0] : "-"}</TableCell>
                                <TableCell>{evalItem.StudentName}</TableCell>
                                <TableCell>{evalItem.NationalNumber}</TableCell>
                                <TableCell>{evalItem.GroupName}</TableCell>
                                <TableCell>{evalItem.MatterName}</TableCell>
                                <TableCell>{evalItem.UnitTypeName}</TableCell>
                                <TableCell>{evalItem.From} - {evalItem.To}</TableCell>
                                <TableCell>{getLevelText(evalItem.LevelID !== undefined ? evalItem.LevelID : evalItem.Level)}</TableCell>
                            </TableRow>
                        );
                    })}
                    {evaluations.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                                لا توجد سجلات تقييم
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
