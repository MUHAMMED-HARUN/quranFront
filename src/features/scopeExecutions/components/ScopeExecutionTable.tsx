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
    Typography,
    CircularProgress,
    Alert
} from "@mui/material";
import { useScopeExecutionsQuery } from "../hooks/useScopeExecutions";
import { useScopeExecutionStore } from "../store/scopeExecutionStore";

export const ScopeExecutionTable = () => {
    const { data: response, isLoading, isError, error } = useScopeExecutionsQuery();
    const { selectedIds, toggleSelection, selectAll, openCard } = useScopeExecutionStore();

    if (isLoading) return <CircularProgress />;
    if (isError) return <Alert severity="error">{(error as Error).message}</Alert>;

    const executions = Array.isArray(response) ? response : ((response as any)?.Value || []);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            selectAll(executions.map((s: any) => s.Id || s.ID));
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
                                indeterminate={selectedIds.length > 0 && selectedIds.length < executions.length}
                                checked={executions.length > 0 && selectedIds.length === executions.length}
                                onChange={handleSelectAll}
                            />
                        </TableCell>
                        <TableCell>الاسم</TableCell>
                        <TableCell>الوصف</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {executions.map((exec: any) => {
                        const id = exec.Id || exec.ID;
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
                                <TableCell>{exec.Name}</TableCell>
                                <TableCell>{exec.Description || "-"}</TableCell>
                            </TableRow>
                        );
                    })}
                    {executions.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} align="center">
                                لا يوجد عمليات تنفيذ
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
