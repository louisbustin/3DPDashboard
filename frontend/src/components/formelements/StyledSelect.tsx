import { FormControl, InputLabel, Select, SelectProps } from "@mui/material";

const StyledSelect = (props: SelectProps) => {
  return (
    <FormControl>
      <InputLabel id={`${props.id}-label`}>{props.label}</InputLabel>
      <Select labelId={`${props.id}-label`} {...props}>
        {props.children}
      </Select>
    </FormControl>
  );
};

export default StyledSelect;
