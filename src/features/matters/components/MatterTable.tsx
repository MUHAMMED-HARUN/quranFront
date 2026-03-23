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
import { useMattersQuery } from "../hooks";
import { useMatterStore } from "../store/matterStore";

export const MatterTable = () => {
    const { data: response, isLoading, isError, error } = useMattersQuery();
    const { selectedIds, toggleSelection, selectAll, openCard } = useMatterStore();

    if (isLoading) return <CircularProgress />;
    if (isError) return <Alert severity="error">{(error as Error).message}</Alert>;

    const matters = (response as any)?.Value || response || [];

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            selectAll(matters.map((m: any) => m.ID || m.Id));
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
                                indeterminate={selectedIds.length > 0 && selectedIds.length < matters.length}
                                checked={matters.length > 0 && selectedIds.length === matters.length}
                                onChange={handleSelectAll}
                            />
                        </TableCell>
                        <TableCell>الاسم</TableCell>
                        <TableCell>المسؤول</TableCell>
                        <TableCell>المقرر</TableCell>
                        <TableCell>الوصف</TableCell>
                        <TableCell>المستوى</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {matters.map((matter: any) => {
                        const id = matter.ID || matter.Id;
                        return (
                            <TableRow
                                key={id}
                                hover
                                onClick={(e) => handleRowClick(id, e)}
                                selected={selectedIds.includes(id)}
                                style={{ cursor: "pointer" }}
                            >
                                <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                        checked={selectedIds.includes(id)}
                                        onChange={() => toggleSelection(id)}
                                    />
                                </TableCell>
                                <TableCell>{matter.Name}</TableCell>
                                <TableCell>{matter.ActorName || "-"}</TableCell>
                                <TableCell>{matter.SubjectName || "-"}</TableCell>
                                <TableCell>{matter.Description || "-"}</TableCell>
                                <TableCell>{matter.Level || "-"}</TableCell>
                            </TableRow>
                        );
                    })}
                    {matters.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                لا يوجد بيانات
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
