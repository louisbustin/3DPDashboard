import {Stack} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {DatePicker} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import React from "react";

export const MAX_DATE = 9999999999999;
export const MIN_DATE = 0;

const DateFilter = (
  props: React.PropsWithoutRef<{
    onDatesChange?: (minDate: number, maxDate: number) => void;
    minDate: number;
    maxDate: number;
  }>,
) => {
  return (
    <>
      <Grid size={{xs: 6}}>
        <Stack direction="row" display="flex" alignItems="center">
          From
          <DatePicker
            sx={{marginLeft: 2, marginRight: 2}}
            onChange={(v: Dayjs | null) =>
              props.onDatesChange &&
              props.onDatesChange(
                v ? v.startOf("day").unix() * 1000 : MIN_DATE,
                props.maxDate || MAX_DATE,
              )
            }
            slotProps={{
              field: {clearable: true},
            }}
            value={props.minDate > MIN_DATE ? dayjs(props.minDate) : null}
            maxDate={
              props.maxDate < MIN_DATE ? undefined : dayjs(props.maxDate)
            }
          />
          to
          <DatePicker
            sx={{marginLeft: 2}}
            onChange={(v: Dayjs | null) => {
              props.onDatesChange &&
              props.onDatesChange(
                props.minDate || MIN_DATE,
                v ? v.endOf("day").unix() * 1000 : MAX_DATE,
              );
            }}
            slotProps={{
              field: {clearable: true},
            }}
            value={props.maxDate < MAX_DATE ? dayjs(props.maxDate) : null}
            minDate={
              props.minDate > MAX_DATE ? undefined : dayjs(props.minDate)
            }
          />
        </Stack>
      </Grid>
    </>
  );
};

export default DateFilter;
