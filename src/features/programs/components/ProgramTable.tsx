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
import { useProgramsQuery } from "../hooks";
import { useProgramStore } from "../store/programStore";

export const ProgramTable = () => {
    const { data: response, isLoading, isError, error } = useProgramsQuery();
    const { selectedIds, toggleSelection, selectAll, openCard } = useProgramStore();

    if (isLoading) return <CircularProgress />;
    if (isError) return <Alert severity="error">{(error as Error).message}</Alert>;

    const programs = (response as any)?.Value || response || [];

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            selectAll(programs.map((p: any) => p.ProgramID));
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
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={selectedIds.length > 0 && selectedIds.length < programs.length}
                                checked={programs.length > 0 && selectedIds.length === programs.length}
                                onChange={handleSelectAll}
                            />
                        </TableCell>
                        <TableCell>اسم البرنامج</TableCell>
                        <TableCell>ملاحظات</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {programs.map((program: any) => (
                        <TableRow
                            key={program.ProgramID}
                            hover
                            onClick={(e) => handleRowClick(program.ProgramID, e)}
                            selected={selectedIds.includes(program.ProgramID)}
                            style={{ cursor: "pointer" }}
                        >
                            <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                    checked={selectedIds.includes(program.ProgramID)}
                                    onChange={() => toggleSelection(program.ProgramID)}
                                />
                            </TableCell>
                            <TableCell>{program.Name}</TableCell>
                            <TableCell>{program.Notes}</TableCell>
                        </TableRow>
                    ))}
                    {programs.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} align="center">
                                لا يوجد بيانات
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
