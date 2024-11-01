import { Typography } from "@mui/material";

const SiteStatus = () => {
  return (
    <>
      <Typography>Recently completed features:</Typography>
      <ul>
        <li>Prints, Printers, Filament management</li>
        <li>Intergration with Octoeverywhere for automated print creation</li>
      </ul>
      <Typography>Features Coming soon:</Typography>
      <ul>
        <li>Spool management</li>
        <li>
          Assign multiple filaments to same print (for tracking multicolor
          printing)
        </li>
        <li>
          More summary dashboards (any input on what is needed is welcome!)
        </li>
        <li>Profile improvements</li>
        <li>Sharing of printers/filaments/prints with other users.</li>
      </ul>
    </>
  );
};

export default SiteStatus;
