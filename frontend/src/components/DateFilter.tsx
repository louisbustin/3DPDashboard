import { Grid, Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";

export const MAX_DATE = 9999999999999;
export const MIN_DATE = 0;

const DateFilter = (
  props: React.PropsWithoutRef<{
    onDatesChange?: (minDate: number, maxDate: number) => void;
    initialMinDate?: number;
    initialMaxDate?: number;
  }>,
) => {
  const [minDateFilter, setMinDateFilter] = useState<number>(
    props.initialMinDate || MIN_DATE,
  );
  const [maxDateFilter, setMaxDateFilter] = useState<number>(
    props.initialMaxDate || MAX_DATE,
  );

  useEffect(() => {
    if (props.onDatesChange) {
      props.onDatesChange(minDateFilter, maxDateFilter);
    }
  }, [minDateFilter, maxDateFilter, props]);

  return (
    <>
      <Grid item xs={6}>
        <Stack direction="row" display="flex" alignItems="center">
          From
          <DatePicker
            sx={{ marginLeft: 2, marginRight: 2 }}
            onChange={(v: Dayjs | null) =>
              setMinDateFilter(v ? v.unix() * 1000 : MIN_DATE)
            }
            slotProps={{
              field: { clearable: true },
            }}
            value={minDateFilter > MIN_DATE ? dayjs(minDateFilter) : null}
            maxDate={
              maxDateFilter < MIN_DATE ? undefined : dayjs(maxDateFilter)
            }
          />
          to
          <DatePicker
            sx={{ marginLeft: 2 }}
            onChange={
              (v: Dayjs | null) =>
                setMaxDateFilter(v ? v.unix() * 1000 + 86399999 : MAX_DATE) //Adding a day's (-1) amount of milliseconds to that the filters include that date
            }
            slotProps={{
              field: { clearable: true },
            }}
            value={maxDateFilter < MAX_DATE ? dayjs(maxDateFilter) : null}
            minDate={
              minDateFilter > MAX_DATE ? undefined : dayjs(minDateFilter)
            }
          />
        </Stack>
      </Grid>
    </>
  );
};

export default DateFilter;
