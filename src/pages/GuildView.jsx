import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useParams, useNavigate } from "react-router-dom";
import Guild from "../components/generic/Guild";

import { Container, Affix, Button, Skeleton, Group, Stack } from "@mantine/core";

import "./Page.scss";
import "./GuildView.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const GuildView = () => {
  const [userContext] = useContext(UserContext);
  let { guildId } = useParams();
  const navigate = useNavigate();
  return (
    <>
      <Container className="main">
        <Affix position={{ top: 60, left: 20 }}>
          <Button onClick={() => navigate(`/guilds`)} leftIcon={<FontAwesomeIcon icon={faArrowLeft}/>}>Go back to Guild Overview</Button>
        </Affix>
        <div className="display-middle">
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

export default GuildView;
