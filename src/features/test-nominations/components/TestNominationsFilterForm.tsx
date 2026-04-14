import React, { useState } from "react";
import { Box, Button, TextField, MenuItem, Grid } from "@mui/material";
import { TestNominationsDtoFilter } from "../types/testNomination.types";

interface Props {
  onSearch: (filter: TestNominationsDtoFilter) => void;
}

export const TestNominationsFilterForm: React.FC<Props> = ({ onSearch }) => {
  const [filter, setFilter] = useState<TestNominationsDtoFilter>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filter);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box p={2} border={1} borderColor="grey.300" borderRadius={2} mb={2}>
        <Box 
          display="grid" 
          gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 1fr' }} 
          gap={2}
        >
          <TextField
            fullWidth
            label="رقم الهوية"
            name="NationalNumber"
            value={filter.NationalNumber || ""}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="اسم الطالب"
            name="StudentName"
            value={filter.StudentName || ""}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="النطاق / التفصيل"
            name="TargetName"
            value={filter.TargetName || ""}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="من تاريخ مقترح"
            name="SuggestedDateFrom"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filter.SuggestedDateFrom || ""}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="إلى تاريخ مقترح"
            name="SuggestedDateTo"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filter.SuggestedDateTo || ""}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            select
            label="حالة الترشيح"
            name="NominationStatus"
            value={filter.NominationStatus || ""}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>-- الكل --</em>
            </MenuItem>
            <MenuItem value={1}>قيد الانتظار</MenuItem>
            <MenuItem value={2}>تم الاختبار</MenuItem>
            <MenuItem value={3}>مرفوض</MenuItem>
          </TextField>
        </Box>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" type="submit">
            بحث
          </Button>
        </Box>
      </Box>
    </form>
  );
};
