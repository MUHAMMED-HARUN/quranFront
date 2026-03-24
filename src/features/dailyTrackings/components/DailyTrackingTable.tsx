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
import { useDailyTrackingsQuery } from "../hooks/useDailyTrackings";
import { useDailyTrackingStore } from "../store/dailyTrackingStore";

export const DailyTrackingTable = () => {
    const { data: response, isLoading, isError, error } = useDailyTrackingsQuery();
    const { selectedIds, toggleSelection, selectAll, openCard } = useDailyTrackingStore();

    if (isLoading) return <CircularProgress />;
    if (isError) return <Alert severity="error">{(error as Error).message}</Alert>;

    const trackings = Array.isArray(response) ? response : ((response as any)?.Value || []);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            selectAll(trackings.map((t: any) => t.Id || t.ID));
        } else {
            selectAll([]);
        }
    };

    const handleRowClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        toggleSelection(id);
        openCard();
    };

    return (
        <TableContainer component={Paper} elevation={2} sx={{ mt: 3 }}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={selectedIds.length > 0 && selectedIds.length < trackings.length}
                                checked={trackings.length > 0 && selectedIds.length === trackings.length}
                                onChange={handleSelectAll}
                            />
                        </TableCell>
                        <TableCell>المقرر</TableCell>
                        <TableCell>الطالب</TableCell>
                        <TableCell>الوحدة الحالية</TableCell>
                        <TableCell>إجمالي الوحدات المستهدفة</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {trackings.map((tracking: any) => {
                        const id = tracking.Id || tracking.ID;
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
                                <TableCell>{tracking.MatterName || tracking.MatterID}</TableCell>
                                <TableCell>{tracking.StudentFullName || tracking.StudentID}</TableCell>
                                <TableCell>{tracking.CurrentUnit}</TableCell>
                                <TableCell>{tracking.TotalScopeUnit}</TableCell>
                            </TableRow>
                        );
                    })}
                    {trackings.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                لا توجد سجلات تتبع
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
