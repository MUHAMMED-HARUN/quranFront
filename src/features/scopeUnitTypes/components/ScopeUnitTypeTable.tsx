import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
    Checkbox,
} from "@mui/material";
import { useScopeUnitTypesQuery } from "../hooks";
import { useScopeUnitTypeStore } from "../store/scopeUnitTypeStore";

export const ScopeUnitTypeTable = () => {
    const { data: response, isLoading, isError, error } = useScopeUnitTypesQuery();
    const { selectedIds, toggleSelection, selectAll } = useScopeUnitTypeStore();

    if (isLoading) return <CircularProgress />;
    if (isError) return <Alert severity="error">{(error as Error).message}</Alert>;

    const records = (response as any)?.Value || response || [];

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            selectAll(records.map((r: any) => r.ID));
        } else {
            selectAll([]);
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={
                                    selectedIds.length > 0 && selectedIds.length < records.length
                                }
                                checked={
                                    records.length > 0 && selectedIds.length === records.length
                                }
                                onChange={handleSelectAll}
                            />
                        </TableCell>
                        <TableCell>اسم الوحدة</TableCell>
                        <TableCell>المستوى</TableCell>
                        <TableCell>ملاحظات</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {records.map((r: any) => (
                        <TableRow
                            key={r.ID}
                            hover
                            onClick={() => toggleSelection(r.ID)}
                            selected={selectedIds.includes(r.ID)}
                            style={{ cursor: "pointer" }}
                        >
                            <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                    checked={selectedIds.includes(r.ID)}
                                    onChange={() => toggleSelection(r.ID)}
                                />
                            </TableCell>
                            <TableCell>{r.Name}</TableCell>
                            <TableCell>{r.LevelNumber}</TableCell>
                            <TableCell>{r.Notes}</TableCell>
                        </TableRow>
                    ))}
                    {records.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                                لا توجد بيانات
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
