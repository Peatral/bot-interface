import React, {useEffect, useState, useContext, useMemo} from "react";
import {useRouter} from "next/router";
import {UserContext} from "@components/context/UserContext";

import {
  Paper,
  Switch,
  TextInput,
  Slider,
  RangeSlider,
  NumberInput,
  Select,
  Title,
  Group,
  Button,
  Stack,
  Divider,
  LoadingOverlay,
  Container,
  Affix,
  Text,
  Code,
  Tooltip,
} from "@mantine/core";
import {showNotification, updateNotification} from "@mantine/notifications";
import {useForm, formList} from "@mantine/form";

import {patchPoll, getPoll, getRoles} from "@utils/apilib";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faCheck} from "@fortawesome/free-solid-svg-icons";

import {getDiff} from "recursive-diff";

import styles from "@styles/pages/PollEditor.module.scss";

import {Durations, getAsTime} from "@utils/timehelper";

const PollEditor = () => {
  const MAX_TIME_INTERVALLS = useMemo(() => {
    return {m: 60 * 24, h: 24 * 7, d: 7};
  }, []);

  const Router = useRouter();

  const pollId = Router.query.id;

  const [userContext] = useContext(UserContext);

  const [poll, setPoll] = useState({
    _id: "",
    entries: [],
    votes: [],
    title: "",
    status: "SCHEDULED",
    duration: Durations.MINUTES * 5,
    minChoices: 1,
    maxChoices: 1,
    roleId: null,
    messageId: null,
    channelId: null,
    guildId: null,
    authorId: null,
  });

  const [roles, setRoles] = useState([]);

  const [fixedSelectAmount, setFixedSelectAmount] = useState(true);

  // Yeh, this is kinda broken, just be sure to never update this in the form without updating the states
  const [minChoices, setMinChoices] = useState(1);
  const [maxChoices, setMaxChoices] = useState(1);
  const [duration, setDuration] = useState(3);
  const [durationUnit, setDurationUnit] = useState("m");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [pollModified, setPollModified] = useState(false);

  // The poll as a form
  const form = useForm({
    initialValues: {
      minChoices: 1,
      maxChoices: 1,
      roleId: "",
      duration: Durations.MINUTES * 5,
      entries: formList([
        {
          label: "Yes",
          description: "Your wish shall be granted...",
          icon: "",
        },
        {
          label: "No",
          description: "Therefore I rightfully object and say: No",
          icon: "",
        },
      ]),
      title: "",
    },

    validate: (values) => ({
      entries:
        values.entries.length < 2 || values.entries.length > 5
          ? "There must be between 2 and 5 entries"
          : null,
      title: values.title === "" ? "Title cannot be empty" : null,
      minChoices:
        values.minChoices <= 0 ? "Min Choices must be at least 1" : null,
    }),
  });

  // hooks below

  // Fetching poll from db, only during loading/saving
  useEffect(() => {
    if (!loading && !saving) {
      return;
    }
    getPoll(userContext.token, pollId).then((json) => {
      setPoll(json);

      if (json.minChoices !== json.maxChoices) {
        setFixedSelectAmount(false);
      }

      setMinChoices(json.minChoices);
      setMaxChoices(json.maxChoices);

      form.values.title = json.title;
      if (json.entries.length >= 2) {
        form.values.entries = formList(json.entries);
      }
      form.values.roleId = json.roleId;
      form.values.duration = json.duration;

      const duration = json.duration;

      const durationData = getAsTime(duration);
      setDurationUnit(durationData.unit);
      setDuration(durationData.amount);

      setLoading(false);
    });
  }, [
    pollId,
    setMinChoices,
    setMaxChoices,
    setFixedSelectAmount,
    form.values,
    setLoading,
    userContext.token,
    loading,
    saving,
  ]);

  // Fetch roles
  useEffect(() => {
    if (poll.guildId) {
      getRoles(userContext.token, poll.guildId).then((json) => {
        if (json.error) {
          return;
        }
        setRoles(json.roles);
      });
    }
  }, [userContext.token, poll.guildId]);

  // Setup wonky sliders
  useEffect(() => {
    if (form.values.minChoices !== minChoices)
      form.values.minChoices = minChoices;
  }, [minChoices, form.values]);
  useEffect(() => {
    if (form.values.maxChoices !== maxChoices)
      form.values.maxChoices = maxChoices;
  }, [maxChoices, form.values]);
  useEffect(() => {
    if (loading) {
      return;
    }
    if (maxChoices > form.values.entries.length) {
      setMaxChoices(form.values.entries.length);
      if (fixedSelectAmount) {
        setMinChoices(maxChoices);
      }
    }
    if (!fixedSelectAmount && minChoices >= form.values.entries.length) {
      setMinChoices(form.values.entries.length - 1);
    }
    form.values.maxChoices = maxChoices;
  }, [form.values, minChoices, maxChoices, fixedSelectAmount, loading]);

  // Setup time picker
  useEffect(() => {
    setDuration(Math.min(duration, MAX_TIME_INTERVALLS[durationUnit]));
  }, [durationUnit, duration, MAX_TIME_INTERVALLS]);
  useEffect(() => {
    form.values.duration =
      {m: Durations.MINUTES, h: Durations.HOURS, d: Durations.DAYS}[
        durationUnit
      ] * duration;
  }, [duration, durationUnit, form.values, MAX_TIME_INTERVALLS]);

  // Change detector, setting update button disabled/enabled
  useEffect(() => {
    if (loading || saving) {
      return;
    }

    // make the form a simple object
    const newPoll = JSON.parse(JSON.stringify(form.values));
    // diff them
    let difflist = getDiff(poll, newPoll);
    // strip the unwanted diffs out
    difflist = difflist.filter(
      (diff) =>
        !(
          diff.op === "delete" &&
          diff.path.length === 1 &&
          [
            "_id",
            "__v",
            "status",
            "startTimestamp",
            "endTimestamp",
            "authorId",
            "guildId",
            "channelId",
            "messageId",
          ]
            .map((s) => diff.path[0].includes(s))
            .includes(true)
        ),
    );

    difflist = difflist.filter(
      (diff) =>
        !(
          diff.op === "delete" &&
          diff.path.length === 3 &&
          diff.path[0] === "entries" &&
          diff.path[2] === "_id"
        ),
    );

    // now we can see if there is a diff or not
    setPollModified(difflist.length > 0);
  }, [
    form.values,
    poll,
    minChoices,
    maxChoices,
    duration,
    durationUnit,
    loading,
    saving,
  ]);

  // The entries
  const fields = form.values.entries.map((entry, index) => (
    <Stack key={index}>
      <Divider variant="dashed" />
      <TextInput
        placeholder="Pineapples rock! 🤘"
        label="Answer"
        required
        {...form.getListInputProps("entries", index, "label")}
      />
      <TextInput
        placeholder="(Sweet pinapple + Juicy Tomato 🍅)"
        label="Description"
        required
        {...form.getListInputProps("entries", index, "description")}
      />
      <Button
        color="red"
        onClick={() => form.removeListItem("entries", index)}
        disabled={form.values.entries.length < 3}
      >
        Remove
      </Button>
    </Stack>
  ));

  const [copiedCommand, setCopiedCommand] = useState(false);

  return (
    <Container className={styles.polleditorContainer}>
      <Affix position={{top: 60, left: 20}}>
        <Button
          onClick={() => Router.push(`/polls`)}
          leftIcon={<FontAwesomeIcon icon={faArrowLeft} />}
        >
          Go back to Poll Overview
        </Button>
      </Affix>
      <Paper className={styles.polleditor} style={{position: "relative"}}>
        <LoadingOverlay visible={loading} />
        <form
          onSubmit={form.onSubmit((values) => {
            setSaving(true);

            showNotification({
              id: "update-poll",
              loading: true,
              title: "Updating Poll",
              message: "Poll is not updated yet, you cannot close this yet",
              autoClose: false,
              disallowClose: true,
            });

            patchPoll(userContext.token, pollId, values).then((json) => {
              setPoll(json);
              updateNotification({
                id: "update-poll",
                color: "teal",
                title: "Poll was updated",
                message:
                  "Notification will close in 3 seconds, you can close this notification now",
                icon: <FontAwesomeIcon icon={faCheck} />,
                autoClose: 3000,
              });
              setSaving(false);
            });
          })}
        >
          <Stack>
            <Title order={1}>Poll Editor</Title>
            <TextInput
              placeholder="Pineapple on pizza? 🍕"
              label="Question"
              required
              {...form.getInputProps("title")}
            />
            <Group grow>
              <NumberInput
                value={duration}
                placeholder="The duration"
                label="How long should the poll be?"
                required
                min={1}
                max={MAX_TIME_INTERVALLS[durationUnit]}
                onChange={(v) => setDuration(v)}
              />
              <Select
                value={durationUnit}
                label="(The time unit measured in)"
                placeholder="Pick one"
                required
                data={[
                  {value: "m", label: "Minutes"},
                  {value: "h", label: "Hours"},
                  {value: "d", label: "Days"},
                ]}
                onChange={(v) => setDurationUnit(v)}
              />
            </Group>
            {roles.length > 0 && (
              <Select
                label="The this poll is targeted at"
                placeholder="Pick one"
                {...form.getInputProps("roleId")}
                data={[{value: "none", label: "None"}].concat(
                  roles.map((role) => {
                    return {
                      value: role.id,
                      label: role.name,
                    };
                  }),
                )}
              />
            )}
            <Switch
              label="Fixed select amount?"
              checked={fixedSelectAmount}
              onChange={(event) => {
                const checked = event.currentTarget.checked;
                if (!checked) {
                  if (maxChoices <= 1) {
                    setMaxChoices(maxChoices + 1);
                  }
                  setMinChoices(maxChoices - 1);
                }
                setFixedSelectAmount(checked);
              }}
            />
            {fixedSelectAmount ? (
              <Slider
                min={1}
                max={form.values.entries.length}
                value={maxChoices}
                marks={[...Array(form.values.entries.length).keys()].map(
                  (i) => {
                    return {value: i + 1};
                  },
                )}
                onChange={(value) => {
                  setMinChoices(value);
                  setMaxChoices(value);
                }}
              />
            ) : (
              <RangeSlider
                min={1}
                max={form.values.entries.length}
                minRange={1}
                value={[minChoices, maxChoices]}
                marks={[...Array(form.values.entries.length).keys()].map(
                  (i) => {
                    return {value: i + 1};
                  },
                )}
                onChange={([min, max]) => {
                  setMinChoices(min);
                  setMaxChoices(max);
                }}
              />
            )}
            <Button
              onClick={() =>
                form.addListItem("entries", {
                  label: "",
                  description: "",
                  emoji: "",
                })
              }
              disabled={form.values.entries.length >= 5}
            >
              Add Entry
            </Button>

            {form.values.entries.length > 0 && (
              <>
                <Stack>{fields}</Stack>
                <Divider />
              </>
            )}
            <Group position="apart" mt="md">
              {poll.status === "OPEN" || poll.status === "CLOSED" ? (
                <Text>Can&apos;t start poll anymore</Text>
              ) : (
                <Text>
                  Start poll with{" "}
                  <Tooltip
                    label={copiedCommand ? "Copied command" : "Copy command"}
                    color={copiedCommand ? "green" : "gray"}
                    withArrow
                  >
                    <Code
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `/poll start id:${poll._id}`,
                        );
                        setCopiedCommand(true);
                        setTimeout(() => setCopiedCommand(false), 3000);
                      }}
                    >
                      /poll start id:{poll._id}
                    </Code>
                  </Tooltip>
                </Text>
              )}
              <Button
                disabled={
                  !pollModified ||
                  poll.status === "OPEN" ||
                  poll.status === "CLOSED"
                }
                type="submit"
                color="green"
                loading={saving}
              >
                Update Poll
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
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

export default PollEditor;
