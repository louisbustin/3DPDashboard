import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { PropsWithChildren, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CollapseArea = (
  props: PropsWithChildren<{
    storageKey?: string;
    initiallyExpanded?: boolean;
    summary?: string;
  }>
) => {
  const [areGraphsExpanded, setAreGraphsExpanded] = useState(
    props.storageKey
      ? localStorage.getItem(props.storageKey) !== "false"
      : props.initiallyExpanded || false
  );
  return (
    <>
      <Accordion
        expanded={areGraphsExpanded}
        onChange={(event, isExpanded) => {
          setAreGraphsExpanded(isExpanded);
          props.storageKey &&
            localStorage.setItem(
              props.storageKey,
              isExpanded ? "true" : "false"
            );
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          {props.summary || "Collapse"}
        </AccordionSummary>
        <AccordionDetails>{props.children}</AccordionDetails>
      </Accordion>
    </>
  );
};

export default CollapseArea;
