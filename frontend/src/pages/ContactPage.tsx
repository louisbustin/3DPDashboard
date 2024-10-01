import { Card, CardContent, Link, Stack, Typography } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

const ContactPage = () => {
  return (
    <>
      <Stack direction="row" justifyContent="center" spacing={2} mt={2}>
        <Card sx={{ minWidth: "30%" }}>
          <CardContent>
            <h3>E-Mail</h3>
            <Typography>
              Need some help? Drop me an email at{" "}
              <Link href="mailto:louis@eforge.us">louis@eforge.us</Link>.
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: "30%" }}>
          <CardContent>
            <h3>Make a ticket</h3>
            <Typography>
              Found a bug? You can send us an email at this address to
              automatically create a bug ticket.{" "}
              <Link href="mailto:contact-project+eforgewebsites-3dpdashboard-51027300-issue-@incoming.gitlab.com">
                contact-project+eforgewebsites-3dpdashboard-51027300-issue-@incoming.gitlab.com
              </Link>
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: "30%" }}>
          <CardContent>
            <h3>Social Media</h3>
            If you just want to communicate, find me on the socials.
            <Stack direction="row">
              <Link
                href="https://www.facebook.com/louisbustin"
                target="_blank"
                rel="noreferrer"
              >
                <FacebookIcon />
              </Link>
              <Link
                href="https://www.instagram.com/purveyorofawesome/"
                target="_blank"
                rel="noreferrer"
              >
                <InstagramIcon />
              </Link>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </>
  );
};

export default ContactPage;
