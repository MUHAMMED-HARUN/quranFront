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
import { useGroupsQuery } from "../hooks";
import { useGroupStore } from "../store/groupStore";

// Using useInstitutesQuery and useInstituteClassesQuery to resolve names instead of IDs
import { useInstituteClassesQuery } from "../../instituteClasses/hooks";
import { useInstitutesQuery } from "../../institutes/hooks";

export const GroupTable = () => {
    const { data: response, isLoading, isError, error } = useGroupsQuery();
    const { data: icResponse } = useInstituteClassesQuery();
    const { data: instResponse } = useInstitutesQuery();

    const { selectedIds, toggleSelection, selectAll, openCard } = useGroupStore();

    if (isLoading) return <CircularProgress />;
    if (isError) return <Alert severity="error">{(error as Error).message}</Alert>;

    const records = (response as any)?.Value || response || [];
    const instituteClasses = Array.isArray(icResponse) ? icResponse : ((icResponse as any)?.Value || []);
    const institutes = Array.isArray(instResponse) ? instResponse : ((instResponse as any)?.Value || []);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            selectAll(records.map((r: any) => r.GroupID));
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
                                indeterminate={
                                    selectedIds.length > 0 && selectedIds.length < records.length
                                }
                                checked={
                                    records.length > 0 && selectedIds.length === records.length
                                }
                                onChange={handleSelectAll}
                            />
                        </TableCell>
                        <TableCell>رمز المجموعة</TableCell>
                        <TableCell>اسم المجموعة</TableCell>
                        <TableCell>الحلقة الدراسية</TableCell>
                        <TableCell>الجهة/المعهد</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {records.map((r: any) => {
                        const currentIC = instituteClasses.find((ic: any) => ic.InstituteClassID === r.InstituteClassID);
                        const instName = currentIC ? institutes.find((i: any) => i.InstituteID === currentIC.InstituteID)?.Name : '';
                        return (
                            <TableRow
                                key={r.GroupID}
                                hover
                                onClick={(e) => handleRowClick(r.GroupID, e)}
                                selected={selectedIds.includes(r.GroupID)}
                                style={{ cursor: "pointer" }}
                            >
                                <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                        checked={selectedIds.includes(r.GroupID)}
                                        onChange={() => toggleSelection(r.GroupID)}
                                    />
                                </TableCell>
                                <TableCell>{r.Code}</TableCell>
                                <TableCell>{r.GroupName}</TableCell>
                                <TableCell>{currentIC?.Class?.Name || "حلقة غير معروفة"}</TableCell>
                                <TableCell>{instName || "جهة غير معروفة"}</TableCell>
                            </TableRow>
                        );
                    })}
                    {records.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                لا توجد بيانات
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
