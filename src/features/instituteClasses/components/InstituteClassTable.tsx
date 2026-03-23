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
import { useInstituteClassesQuery } from "../hooks";
import { useInstitutesQuery } from "../../institutes/hooks/useInstitutesQuery";
import { useInstituteClassStore } from "../store/instituteClassStore";

export const InstituteClassTable = () => {
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useInstituteClassesQuery();
  const { selectedIds, toggleSelection, selectAll, openCard } =
    useInstituteClassStore();

  const { data: institutesResponse } = useInstitutesQuery();

  if (isLoading) return <CircularProgress />;
  if (isError)
    return <Alert severity="error">{(error as Error).message}</Alert>;

  const records = (response as any)?.Value || response || [];
  const institutes = Array.isArray(institutesResponse)
    ? institutesResponse
    : (institutesResponse as any)?.Value || [];

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      selectAll(records.map((r: any) => r.InstituteClassID));
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
            <TableCell>الجهة/المعهد</TableCell>
            <TableCell>الحلقة</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((r: any) => (
            <TableRow
              key={r.InstituteClassID}
              hover
              onClick={(e) => handleRowClick(r.InstituteClassID, e)}
              selected={selectedIds.includes(r.InstituteClassID)}
              style={{ cursor: "pointer" }}
            >
              <TableCell
                padding="checkbox"
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  checked={selectedIds.includes(r.InstituteClassID)}
                  onChange={() => toggleSelection(r.InstituteClassID)}
                />
              </TableCell>
              <TableCell>
                {institutes.find((i: any) => i.InstituteID === r.InstituteID)
                  ?.Name || "جهة غير معروفة"}
              </TableCell>
              <TableCell>{r.Class?.Name}</TableCell>
            </TableRow>
          ))}
          {records.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} align="center">
                لا توجد بيانات
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
