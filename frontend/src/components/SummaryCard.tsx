import { Avatar } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {JSX, PropsWithoutRef} from "react";
import { useNavigate } from "react-router-dom";

const SummaryCard = (
  props: PropsWithoutRef<{
    title: string;
    total?: number;
    iconLocation?: string;
    iconElement?: JSX.Element;
    color?: "primary" | "secondary";
    sx?: object;
    link?: string;
  }>
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
    >
      {(props.iconLocation || props.iconElement) && (
        <Box sx={{ width: 64, height: 64 }}>
          <Avatar sx={{ width: 64, height: 64 }}>
            {props.iconLocation && (
              <img src={props.iconLocation} width={64} alt="" />
            )}
            {props.iconElement && props.iconElement}
          </Avatar>
        </Box>
      )}

      <Stack spacing={0.5}>
        {props.total !== null && (
          <Typography variant="h4">{props.total}</Typography>
        )}

        <Typography variant="subtitle2" sx={{ color: "text.disabled" }}>
          {props.title}
        </Typography>
      </Stack>
    </Card>
  );
};

export default SummaryCard;
