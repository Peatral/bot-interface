import React, {useContext} from "react";
import {useRouter} from "next/router";
import {UserContext} from "@components/context/UserContext";
import Guild from "@components/Guild/Guild";

import {Container, Affix, Button, Skeleton, Group, Stack} from "@mantine/core";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

const GuildView = () => {
  const [userContext] = useContext(UserContext);
  const Router = useRouter();
  const guildId = Router.query.id;
  return (
    <>
      <Container className="main">
        <Affix position={{top: 60, left: 20}}>
          <Button
            onClick={() => Router.push(`/guilds`)}
            leftIcon={<FontAwesomeIcon icon={faArrowLeft} />}
          >
            Go back to Guild Overview
          </Button>
        </Affix>
        <div className="page-display-middle">
          {userContext.guilds && Array.isArray(userContext.guilds) ? (
            <Guild
              guild={userContext.guilds.find((guild) => guild.id === guildId)}
            />
          ) : (
            <Container style={{minWidth: "20rem"}}>
              <Group>
                <Skeleton height={50} circle mb="xl" />
                <Stack style={{width: "70%"}}>
                  <Skeleton height={8} radius="xl" />
                  <Skeleton height={8} mt={6} radius="xl" />
                  <Skeleton height={8} mt={6} width="70%" radius="xl" />
                </Stack>
              </Group>
            </Container>
          )}
        </div>
      </Container>
    </>
  );
};

export async function getStaticPaths() {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
}

export async function getStaticProps(context) {
  return {
    props: {
      protected: true,
    },
  };
}

export default GuildView;
