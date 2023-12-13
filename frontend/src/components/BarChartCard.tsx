import { BarChart } from "@mui/x-charts";
import { BarChartProps } from "@mui/x-charts/BarChart/BarChart";
import Typography from "@mui/material/Typography";
import { PropsWithoutRef } from "react";
import { Card } from "@mui/material";

const BarChartCard = (
  props: PropsWithoutRef<{
    color?: "primary" | "secondary";
    sx?: object;
    link?: string;
    barCharProps: BarChartProps;
    title?: string;
    height?: string;
  }>
) => {
  return (
    <Card sx={{ pt: 1, pb: 1 }}>
      <Typography
        variant="subtitle2"
        sx={{
          color: "text.disabled",
        }}
        align="center"
      >
        {props.title}
      </Typography>
      <BarChart {...props.barCharProps} sx={{ align: "center" }} />
    </Card>
  );
};

export default BarChartCard;
