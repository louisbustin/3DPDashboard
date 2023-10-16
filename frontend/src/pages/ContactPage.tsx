import { Card, CardContent, Stack, Typography } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
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
              <a href="mailto:louis@eforge.us">louis@eforge.us</a>.
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: "30%" }}>
          <CardContent>
            <h3>Make a ticket</h3>
            <Typography>
              Found a bug? You can send us an email at this address to
              automatically create a bug ticket.{" "}
              <a href="mailto:contact-project+eforgewebsites-3dpdashboard-51027300-issue-@incoming.gitlab.com">
                contact-project+eforgewebsites-3dpdashboard-51027300-issue-@incoming.gitlab.com
              </a>
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: "30%" }}>
          <CardContent>
            <h3>Social Media</h3>
            <Typography>
              If you just want to communicate, find me on the socials.
              <Stack direction="row">
                <a
                  href="https://www.facebook.com/louisbustin"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FacebookIcon />
                </a>
                <a
                  href="https://twitter.com/louisbustin"
                  target="_blank"
                  rel="noreferrer"
                >
                  <TwitterIcon />
                </a>
                <a
                  href="https://www.instagram.com/purveyorofawesome/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <InstagramIcon />
                </a>
              </Stack>
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </>
  );
};

export default ContactPage;
