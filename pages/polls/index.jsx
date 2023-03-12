import React, {useEffect, useState, useContext} from "react";
import {useRouter} from "next/router";

import {
  Stack,
  Paper,
  Title,
  Container,
  Button,
  Space,
  Group,
  Skeleton,
  Card,
  Badge,
} from "@mantine/core";

import {UserContext} from "@components/context/UserContext";
import {getAuthorPolls} from "@utils/botapilib";

import {getAsTime} from "@utils/timehelper";

const Polls = () => {
  const Router = useRouter();
  const [userContext] = useContext(UserContext);

  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userContext.details) {
      return;
    }
    getAuthorPolls(userContext.token, userContext.details.id).then((json) => {
      setPolls(json.polls);
      setLoading(false);
    });
  }, [userContext.token, userContext.details]);

  return (
    <Container size="md" style={{minWidth: "40vw"}}>
      <Stack>
        {loading ? (
          <>
            {[...Array(3).keys()].map((i) => (
              <Paper p="lg" key={i}>
                <Container>
                  <Skeleton height={8} mt={10} radius="xl" />
                  <Space h="lg" />
                  <Skeleton height={8} mt={6} radius="xl" />
                  <Skeleton height={8} mt={6} radius="xl" />
                  <Skeleton height={8} mt={6} width="70%" radius="xl" />
                </Container>
              </Paper>
            ))}
          </>
        ) : (
          <>
            {polls.reverse().map((poll, index) => (
              <Card p="md" key={index}>
                <Group position="apart">
                  <Title order={2}>{poll.title}</Title>
                  <Group>
                    {poll.maxChoices === 1 ? (
                      <Badge color="pink" variant="light">
                        Single Select
                      </Badge>
                    ) : (
                      <Badge color="yellow" variant="light">
                        Multi Select
                      </Badge>
                    )}
                    {
                      {
                        SCHEDULED: (
                          <Badge color="blue" variant="light">
                            Scheduled
                          </Badge>
                        ),
                        OPEN: (
                          <Badge color="green" variant="light">
                            Active
                          </Badge>
                        ),
                        CLOSED: (
                          <Badge color="red" variant="light">
                            Closed
                          </Badge>
                        ),
                      }[poll.status]
                    }
                    {
                      {
                        m: (
                          <Badge color="blue" variant="light">{`${
                            getAsTime(poll.duration).amount
                          } Minute(s)`}</Badge>
                        ),
                        h: (
                          <Badge color="green" variant="light">{`${
                            getAsTime(poll.duration).amount
                          } Hour(s)`}</Badge>
                        ),
                        d: (
                          <Badge color="red" variant="light">{`${
                            getAsTime(poll.duration).amount
                          } Day(s)`}</Badge>
                        ),
                      }[getAsTime(poll.duration).unit]
                    }
                  </Group>
                </Group>
                <Space h="md" />
                <Group grow>
                  <Button
                    onClick={() => Router.push(`/polls/${poll._id}`)}
                    disabled={
                      poll.status === "OPEN" || poll.status === "CLOSED"
                    }
                  >
                    View
                  </Button>
                </Group>
              </Card>
            ))}
          </>
        )}
      </Stack>
    </Container>
  );
};

export async function getStaticProps(context) {
  return {
    props: {
      protected: true,
    },
  };
}

export default Polls;
