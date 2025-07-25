import { Card } from "@mui/material";
import Typography from "@mui/material/Typography";
import { PieChart } from "@mui/x-charts";
import { PieChartProps } from "@mui/x-charts/PieChart/PieChart";
import { PropsWithoutRef } from "react";

const PieChartCard = (
  props: PropsWithoutRef<{
    color?: "primary" | "secondary";
    sx?: object;
    link?: string;
    pieChartProps: PieChartProps;
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
      <PieChart {...props.pieChartProps} sx={{ align: "center" }} />
    </Card>
  );
};

export default PieChartCard;
