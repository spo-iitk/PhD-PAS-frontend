import {
  Avatar,
  Box,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import LanguageIcon from "@mui/icons-material/Language";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Image from "next/image";
import Zoom from "@mui/material/Zoom";

import formstyles from "@styles/Form.module.css";
import Meta from "@components/Meta";
import whoami from "@callbacks/auth/whoami";
import useStore from "@store/store";

const teamMembers = [
  {
    src: "/images/Krishnansh.jpg",
    name: "Krishnansh Agarwal",
    title: "Web Head, 2023-24",
    about: "",
    linkedin: "https://www.linkedin.com/in/krishnansh-agarwal/",
  },
  {
    src: "/images/Utkarsh.jpg",
    name: "Utkarsh Mishra",
    title: "Web Head, 2023-24",
    about: "",
    linkedin: "https://www.linkedin.com/in/utkarsh-mishra-086251228",
  },
];

// const contributors = [
//   { name: "Tejas Ahuja" },
//   { name: "Utkarsh Mishra" },
//   { name: "S Amandeep" },
//   { name: "Krishnansh Agrawal" },
//   { name: "Adarsh Shaw" },
//   { name: "Aditya Bangar" },
// ];
function Person({ data }: any) {
  return (
    <div className={formstyles.tiles} style={{ height: "100%" }}>
      <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            flexWrap: "wrap",
            "& > div": { minWidth: "clamp(0px, (150px - 100%) * 999 ,100%)" },
          }}
        >
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Avatar
              variant="rounded"
              imgProps={{
                width: "500",
                height: "500",
                loading: "lazy",
              }}
              src={data.src}
              alt={data.name}
              {...(data.src.startsWith(
                "https://avatars.githubusercontent.com"
              ) && {
                src: `${data.src}?s=70`,
                srcSet: `${data.src}?s=140 2x`,
              })}
              sx={{
                width: 250,
                height: 250,
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark" ? "primary.700" : "primary.100",
                borderRadius: 1,
              }}
            />
          </Box>

          <Box mx="auto" height={15} />
          <Box sx={{ mt: -0.5, mr: -0.5 }}>
            {data.website && (
              <IconButton
                aria-label={`${data.name} website`}
                component="a"
                href={data.website}
                target="_blank"
                rel="noreferrer noopener"
              >
                <LanguageIcon fontSize="small" sx={{ color: "grey.500" }} />
              </IconButton>
            )}
            {data.linkedin && (
              <IconButton
                aria-label={`${data.name} linkedin`}
                component="a"
                href={data.linkedin}
                target="_blank"
                rel="noreferrer noopener"
              >
                <LinkedInIcon fontSize="small" sx={{ color: "grey.500" }} />
              </IconButton>
            )}
          </Box>
        </Box>
        <Typography variant="body2" fontWeight="bold" sx={{ mt: 2, mb: 0.5 }}>
          {data.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.title}
        </Typography>
        {data.about && (
          <Divider
            sx={{
              my: 1,
              borderColor: (theme) =>
                theme.palette.mode === "dark" ? "primaryDark.400" : "grey.100",
            }}
          />
        )}
        {data.about && (
          <Typography variant="body2" color="text.secondary">
            {data.about}
          </Typography>
        )}
      </Paper>
    </div>
  );
}

// function Others({ data }: any) {
//   return (
//     <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
//       <Stack spacing={2} justifyContent="center" alignItems="center">
//         <Typography variant="body2" fontWeight="bold">
//           {data.name}
//         </Typography>
//       </Stack>
//     </Paper>
//   );
// }
function Credits() {
  const { token } = useStore();
  useEffect(() => {
    if (token !== undefined) whoami.credits(token);
  }, [token]);

  return (
    <div style={{ minHeight: "80vh", margin: "50px auto", width: "90%" }}>
      <Meta title="Credits -  Recruitment Automation System" />
      <h2 style={{ textAlign: "center", fontSize: 50 }}>Credits</h2>
      <Box sx={{ pt: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} lg={4}>
            <div className={formstyles.creditsimage}>
              <Image
                src="/images/credits.gif"
                alt="logo"
                width={800}
                height={800}
              />
            </div>
          </Grid>
          <Grid item xs={12} lg={8}>
            <div>
              <Stack spacing={50} direction="column">
                <Grid container spacing={5}>
                  <Zoom in style={{ transitionDelay: "500ms" }}>
                    <Grid item xs={12} sm={4} md={4}>
                      <Person data={teamMembers[0]} />
                    </Grid>
                  </Zoom>
                  <Zoom in style={{ transitionDelay: "700ms" }}>
                    <Grid item xs={12} sm={4} md={4}>
                      <Person data={teamMembers[1]} />
                    </Grid>
                  </Zoom>
                </Grid>
                {/* <Zoom in style={{ transitionDelay: "1300ms" }}>
                  <div>
                    <Typography
                      align="justify"
                      sx={{ fontSize: 14.5, padding: "10px" }}
                    >
                      The Recruitment Automation System is built by this team of
                      undergrads for use in Placement and Internship drives at
                      IIT Kanpur. The portal aims to facilitate the recruitment
                      process by providing essential automation recourses. It
                      provides information exchange between Students, Companies,
                      and Placement Office. <br />
                      The students above undertook the development of the
                      Recruitment Automation System. The team developed the
                      portal on a microservice-based architecture using Next.js
                      and Go.
                    </Typography>
                  </div>
                </Zoom> */}
              </Stack>
            </div>
          </Grid>
        </Grid>
      </Box>
      <hr style={{ width: "80vw", margin: "50px auto", opacity: 0.5 }} />
      {/* <h2 style={{ textAlign: "center" }}>Other Contributors</h2>
      <Box sx={{ margin: "30px auto", width: "60%" }}>
        <Grid container spacing={2}>
          {contributors.map((contributor) => (
            <Grid item xs={12} sm={6} md={4}>
              <Others data={contributor} />
            </Grid>
          ))}
        </Grid>
      </Box> */}
    </div>
  );
}
Credits.layout = "Navigation";
export default Credits;
