import React from "react";
import { Box, Button, Grid, Heading } from "theme-ui";
import Container from "../components/Container";
import Nav from "../components/Nav";
import { Link } from "react-router-dom";

function GetStarted () {

  return (
    <Container maxWidth={900}>
      <Box>
        <Heading sx={{ mb: 4 }}>Your pages</Heading>
        <Grid sx={{ gridTemplateColumns: "max-content" }}>
        <Link to="/admin/build-page">
            <Button variant="tile">Create new page</Button>
          </Link>
        </Grid>
      </Box>
    </Container>
  );

}


function Home () {

  return (
    <>
      <Nav/>
      <GetStarted/>
    </>
  );

}

export default Home;
