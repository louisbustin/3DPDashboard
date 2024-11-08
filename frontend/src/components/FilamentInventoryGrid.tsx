import {PropsWithoutRef, useState} from "react";
import IFilament from "../models/IFilament";
import {Grid, Stack} from "@mui/material";
import FilamentInventoryGridItem from "./FilamentInventoryGridItem";
import ShrunkTextField from "./formelements/ShrunkTextField";

const FilamentInventoryGrid = (props: PropsWithoutRef<{
  data: IFilament[],
  onEditSuccess?: (filament: IFilament) => void
}>) => {
  const [filter, setFilter] = useState("");
  return <>
    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
      <ShrunkTextField
        label="Search"
        placeholder="Search"
        sx={{
          marginBottom: 2,
          width: 200,
          maxWidth: 200
        }}
        onChange={(e) => setFilter(e.target.value)}
      />
    </Stack>
    <Grid container direction="row" spacing={2} alignItems="center" justifyContent="center">
      {props.data.filter((f) =>
        f.brand.toLowerCase().includes(filter.toLowerCase()) ||
        f.name.toLowerCase().includes(filter.toLowerCase()) ||
        f.color.toLowerCase().includes(filter.toLowerCase())).map((filament) =>
        <FilamentInventoryGridItem filament={filament} key={filament.id}
                                   onEditSuccess={props.onEditSuccess}/>)}
    </Grid>
  </>;
};

export default FilamentInventoryGrid;