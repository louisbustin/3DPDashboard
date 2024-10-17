import { Box, MenuItem, useTheme } from "@mui/material";
import useFilament from "../../hooks/use-filament";
import { FilamentStatus } from "../../models/IFilament";
import StyledSelect from "./StyledSelect";

const FilamentSelection = (
  props: React.PropsWithoutRef<{
    id?: string;
    label?: string;
    filamentId?: string;
    onChange?: (filamentId: string) => void;
  }>
) => {
  const filaments = useFilament();
  const theme = useTheme();
  return (
    <>
      {!filaments.isLoading && (
        <StyledSelect
          id={props.id || "printer-filament"}
          label={props.label || "Filament"}
          value={props.filamentId}
          onChange={(e) => {
            if (props.onChange) {
              props.onChange(e.target.value as string);
            }
          }}
        >
          {filaments.filament
            ?.filter(
              (f) =>
                f.filamentStatus === FilamentStatus.Active ||
                f.filamentStatus === undefined
            )
            ?.sort(
              (a, b) =>
                a.type.localeCompare(b.type) ||
                a.brand.localeCompare(b.brand) ||
                a.name.localeCompare(b.name) ||
                a.color.localeCompare(b.color)
            )
            .map((f) => {
              return (
                <MenuItem key={f.id} value={f.id}>
                  <Box
                    sx={{
                      backgroundColor: f.colorCode || "",
                      color:
                        f.colorCode &&
                        theme.palette.getContrastText(f.colorCode),
                      marginRight: 1,
                      marginLeft: 0,
                      paddingLeft: 1,
                      paddingRight: 1,
                      borderRadius: 10,
                    }}
                  >
                    {f.color}
                  </Box>
                  {f.brand} {f.name && ` - ${f.name}`} {f.type && `(${f.type})`}
                </MenuItem>
              );
            })}
        </StyledSelect>
      )}
    </>
  );
};

export default FilamentSelection;
