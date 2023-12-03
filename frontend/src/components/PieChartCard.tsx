import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PieChart } from "@mui/x-charts";
import { PieChartProps } from "@mui/x-charts/PieChart/PieChart";
import { PropsWithoutRef } from "react";
import { useNavigate } from "react-router-dom";

const PieChartCard = (
  props: PropsWithoutRef<
    | {
        color?: "primary" | "secondary";
        sx?: object;
        link?: string;
      } & PieChartProps
  >
) => {
  const navigate = useNavigate();

  return (
    <Card
      component={Stack}
      spacing={3}
      direction="row"
      sx={{
        px: 3,
        py: 5,
        borderRadius: 2,
        ...props.sx,
      }}
      justifyContent="center"
      onClick={() => {
        if (props.link) navigate(props.link);
      }}
      style={{ cursor: props.link ? "pointer" : "default" }}
      height={200}
    >
      <Typography variant="subtitle2" sx={{ color: "text.disabled" }}>
        {props.title}
      </Typography>
      <PieChart {...props} />
    </Card>
  );
};

export default PieChartCard;
