import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";

import { Stack, Paper, Title, Container, Button, Space, Group, Skeleton, Card, Badge } from "@mantine/core";

import { UserContext } from "../context/UserContext";
import { getAuthorPolls } from "../apilib";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const Polls = () => {
  const [userContext] = useContext(UserContext);

  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userContext.details) {
      return;
    }
    getAuthorPolls(userContext.token, userContext.details.id)
    .then(json => {
      setPolls(json.polls);
      setLoading(false);
    })
  }, [userContext.token, userContext.details])

  return (
    <Container size="md" style={{minWidth:"50vw"}}>
      <Stack>
        {
          loading ? <> 
            {
              [...Array(3).keys()].map(i => (
                <Paper p="lg" key={i}>
                <Container>
                  <Skeleton height={8} mt={10} radius="xl" />
                  <Space h="lg"/>
                  <Skeleton height={8} mt={6} radius="xl" />
                  <Skeleton height={8} mt={6} radius="xl" />
                  <Skeleton height={8} mt={6} width="70%" radius="xl" />
                </Container>
              </Paper>
              ))
            }
          </> : <> 
            {
              polls.map((poll, index) => (
                <Card p="md" key={index}>
                  <Group position="apart">
                    <Title order={2}>{poll.title}</Title>
                    <Group>
                      {
                        poll.maxChoices === 1 ? <Badge color="pink" variant="light">
                          Single Select
                        </Badge> : <Badge color="yellow" variant="light">
                          Multi Select
                        </Badge>
                      }
                      {
                        poll.status === "SCHEDULED" && (<Badge color="blue" variant="light">Scheduled</Badge>)
                      }
                      {
                        poll.status === "OPEN" && (<Badge color="green" variant="light">Active</Badge>)
                      }
                      {
                        poll.status === "CLOSED" && (<Badge color="red" variant="light">Closed</Badge>)
                      }
                    </Group>
                  </Group>
                  <Space h="md"/>
                  <Group grow>
                    <Button component={Link} to={`/polls/${poll._id}`}>View</Button>
                  </Group>
                </Card>
              ))
            }
          </>
        }
      </Stack>
    </Container>
  );
};

export default Polls;
