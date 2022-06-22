import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";

import { Stack, Paper, Title, Container, Button, Space, Group } from "@mantine/core";

import { UserContext } from "../context/UserContext";
import { getAuthorPolls } from "../apilib";

const Polls = () => {
  const [userContext] = useContext(UserContext);

  const [polls, setPolls] = useState([]);

  useEffect(() => {
    if (!userContext.details) {
      return;
    }
    getAuthorPolls(userContext.token, userContext.details.id)
    .then(json => {
      setPolls(json.polls);
    })
  }, [userContext.token, userContext.details])

  return (
    <div>
      <Stack>
        {
          polls.map((entry, index) => (
            <Paper p="md" key={index}>
              <Container>
                <Title order={2}>{entry.title}</Title>
                <Space h="md"/>
                <Group grow>
                  <Button component={Link} to={`/polls/${entry._id}`}>View</Button>
                </Group>
              </Container>
              
            </Paper>
          ))
        }
      </Stack>
    </div>
  );
};

export default Polls;
