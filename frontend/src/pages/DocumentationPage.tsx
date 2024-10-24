import { Box } from "@mui/material";
import NormalLink from "../components/links/NormalLink";
import { Link } from "react-router-dom";

const DocumentationPage = () => {
  return (
    <>
      <h1>Documentation</h1>
      <Box marginBottom={2}>
        3DP Dashboard is designed to assist you in making sense of multiple 3d
        printers, allowing you to track prints, filaments, and, with integration
        with OctoEverywhere, automatically seeing status and images of all
        prints.
      </Box>
      <Box marginBottom={2}>
        Integration with OctoEverywhere is NOT necessary. Without that, you can
        still manage printers, filaments, and add prints to track success and
        failure. The integration simply allows those prints to be automatically
        added to your dashboard.
      </Box>
      <Box>
        To get started, add a printer from the Printers Dashboard, or by going
        straight to <NormalLink to="/printers">printer management</NormalLink>.
      </Box>
      <h2>Printers</h2>
      <Box>
        Printers are the heart of 3DP Dashboard. Any other action is centered
        around a printer. When adding a new printer, the user is presented with
        several options:
        <ul>
          <li>Brand - The brand of the printer (Bambu Labs, Voron, et al)</li>
          <li>Name - The users name for the printer.</li>
          <li>
            Type - The type of this printer. Currently on FDM is supported.
            Resin printers (and associated resin and other options) are slated
            for support in future releases.
          </li>
          <li>
            Octoeverwhere Printer Id - the PrinterId for this printer in
            Octoeverywhere. This is used to link print logs to your printer. See
            the Octoeverywhere section for details.
          </li>
        </ul>
      </Box>
      <h2>Filament</h2>
      <Box>
        Users can manage filaments via the{" "}
        <NormalLink to="/filament">Filament</NormalLink> page. Filaments have
        several details to be filled in as desired:
        <ul>
          <li>Brand - the brand of the filament</li>
          <li>
            Name - The name or line of this filament (i.e. Polymaker PolyTerra)
          </li>
          <li>Color - String of the color name of this filament.</li>
          <li>
            ColorCode - Clicking this button will open a color pallete and allow
            the user to selected a RGB value for this filament.
          </li>
          <li>
            Type - Type of the filament (PLA, ABS, et al). This for now is an
            open string for input of any filament type. A future release may
            attempt to consolidate this into a drop down of filament types (no
            promises).
          </li>
          <li>
            Total weight - the weight of the spool. Defaulted to 1000mg (or
            1kg).
          </li>
          <li>
            Lower Print Temp - the recommended lower bound of printing
            temperature.
          </li>
          <li>
            High Print Temp - the recommended upper bound of printing
            temperature.
          </li>
          <li>
            Low Bed Temp - the recommended lower bound of bed temperature.
          </li>
          <li>
            High Bed Temp - the recommended upper bound of bed temperature.
          </li>
          <li>
            Status - allows the user to inactivate this filament if no longer
            this filament is no longer being used. An inactive filament will no
            longer show in any drop downs, and will be hidden from the filament
            page by default, while still maintaining a link to any prints that
            have used this filament.
          </li>
        </ul>
      </Box>
      <h2>Resin</h2>
      <Box>Resin support is planned for future releases.</Box>
      <h2>Prints</h2>
      <Box>
        Prints are the core of 3DP Dashboard. A print is a record of a print job
        that has been completed. A print can be added manually, or automatically
        if the printer is linked to OctoEverywhere.
      </Box>
      <h2>OctoEverywhere</h2>
      <Box>
        OctoEverywhere is a service that allows you to monitor and control your
        3D printer from anywhere. 3DP Dashboard integrates with OctoEverywhere
        to automatically add prints to your dashboard.
      </Box>
      <Box marginTop={2}>
        To link a printer to OctoEverywhere, you will need to know the PrinterId
        for the printer you wish to link. This can be found in the
        OctoEverywhere installation logs for each printer. This article can
        assist in find those logs:{" "}
        <Link to="https://intercom.help/octoeverywhere/en/articles/8845121-get-the-octoeverywhere-installer-logs">
          Get the OctoEverywhere Installer Logs
        </Link>{" "}
        Once you have the PrinterId, you can add it to the printer in the
        Printers Dashboard. This will allow 3DP Dashboard to automatically add
        prints to your dashboard.
      </Box>
      <Box marginTop={2}>
        One final configuration is needed. Octoeverywhere must be configured to
        call the web hook in 3DP Dashboard. In OctoEverywhere, click on your
        user icon in the top right. Then click on "Setup or Change Printer
        Notifications". Click on "Custom Webhook" and set the URL to
        "https://api.3dpdashboard.com/logprint"
      </Box>
      <Box></Box>
      <h2>Support</h2>
      <Box>
        If you have any questions or need support, please reach out to us at via
        our <NormalLink to="/contact">Contact</NormalLink> page.
      </Box>
    </>
  );
};

export default DocumentationPage;
