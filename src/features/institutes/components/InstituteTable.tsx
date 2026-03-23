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
import { useInstitutesQuery } from "../hooks";
import { useInstituteStore } from "../store/instituteStore";

export const InstituteTable = () => {
  const { data: response, isLoading, isError, error } = useInstitutesQuery();
  const { selectedIds, toggleSelection, selectAll, openCard } =
    useInstituteStore();

  if (isLoading) return <CircularProgress />;
  if (isError)
    return <Alert severity="error">{(error as Error).message}</Alert>;

  const institutes = (response as any)?.Value || response || [];

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      selectAll(institutes.map((i: any) => i.InstituteID));
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
                  selectedIds.length > 0 &&
                  selectedIds.length < institutes.length
                }
                checked={
                  institutes.length > 0 &&
                  selectedIds.length === institutes.length
                }
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell>اسم الجهة</TableCell>
            <TableCell>ملاحظات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {institutes.map((institute: any) => (
            <TableRow
              key={institute.InstituteID}
              hover
              onClick={(e) => handleRowClick(institute.InstituteID, e)}
              selected={selectedIds.includes(institute.InstituteID)}
              style={{ cursor: "pointer" }}
            >
              <TableCell
                padding="checkbox"
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  checked={selectedIds.includes(institute.InstituteID)}
                  onChange={() => toggleSelection(institute.InstituteID)}
                />
              </TableCell>
              <TableCell>{institute.Name}</TableCell>
              <TableCell>{institute.Notes}</TableCell>
            </TableRow>
          ))}
          {institutes.length === 0 && (
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
