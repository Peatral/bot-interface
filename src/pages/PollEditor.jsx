import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";

import { Paper, Switch, TextInput, Slider, RangeSlider, NumberInput, Select, Title, Group, Button, Stack, Divider } from '@mantine/core';

import { useForm, formList } from '@mantine/form';

import "./PollEditor.scss";

const PollEditor = () => {
  const { guildId, pollId } = useParams();

  const [userContext, setUserContext] = useContext(UserContext);

  const [roles, setRoles] = useState([]);

  const [fixedSelectAmount, setFixedSelectAmount] = useState(true);

  // Yeh, this is kinda broken, just be sure to never update this in the form without updating the states
  const [minChoices, setMinChoices] = useState(1);
  const [maxChoices, setMaxChoices] = useState(1);
  
  const form = useForm({
    initialValues: {
      minChoices: 1,
      maxChoices: 1,
      roleId: "",
      duration: 1000,
      entries: formList([{
        name: "Yes",
        description: "Your wish shall be granted...",
        emoji: ""
      }, {
        name: "No",
        description: "Therefore I rightfully object and say: No",
        emoji: ""
      }]),
      title: "",
    },

    validate: (values) => ({
      entries: values.entries.length < 2 || values.entries.length > 5 ? "There must be between 2 and 5 entries" : null,
      title: values.title === "" ? "Title cannot be empty" : null,
      minChoices: values.minChoices <= 0 ? "Min Choices must be at least 1" : null,
    }),
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/guilds/${guildId}/roles`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
    })
    .then(res => res.json())
    .then(json => {
      if (json.error) {
        return;
      }
      setRoles(json.roles);
    })
  }, [userContext.token, guildId]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/polls/${guildId}/${pollId}`)
      .then(res => res.json())
      .then(json => {
        form.values.minChoices = json.minChoices;
        form.values.maxChoices = json.maxChoices;
        setMinChoices(form.values.minChoices);
        setMaxChoices(form.values.maxChoices);

        if (json.minChoices !== json.maxChoices) {
          setFixedSelectAmount(false);
        }

        form.values.title = json.title;
        if (json.entries.length >= 2) {
          form.values.entries = formList(json.entries);
        }
        form.values.roleId = json.roleId;
        form.values.duration = json.duration;
      });
  }, [guildId, pollId, setMinChoices, setMaxChoices, setFixedSelectAmount]);

  const fields = form.values.entries.map((entry, index) => (
    <Stack key={index}>
      <Divider variant="dashed"/>
        <TextInput 
          placeholder="Pineapples rock! 🤘" 
          label="Answer" 
          required 
          {...form.getListInputProps('entries', index, 'name')} 
          value={entry.name}/>
        <TextInput 
          placeholder="(Sweet pinapple + Juicy Tomato 🍅)" 
          label="Description" 
          required 
          {...form.getListInputProps('entries', index, 'description')} 
          value={entry.description}
        />
      <Button
        color="red"
        onClick={() => form.removeListItem('entries', index)}
        disabled={form.values.entries.length < 3}
      >
        Remove
      </Button>
    </Stack>
  ));

  return (
    <div className={"polleditor-container"}>
      <Paper p="md" className={"polleditor"}>
        <form onSubmit={form.onSubmit((values) => {
          fetch(`${process.env.REACT_APP_BACKEND_URL}/polls/${guildId}/${pollId}`, {
            method: 'PATCH',
            body: JSON.stringify(values),
            credentials: "include",
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          })
            .then((response) => response.json())
            .then((json) => console.log(json))
        })}>
        <Stack>
          <Title order={1}>Poll Editor</Title>
          <TextInput placeholder="Pineapple on pizza? 🍕" label="Question" required {...form.getInputProps('title')}/>
          <NumberInput defaultValue={30000} placeholder="The duration" label="How long should the poll be?" required />
          {
            roles.length > 0 &&
            <Select label="The this poll is targeted at" placeholder="Pick one" {...form.getInputProps('roleId')}
              data={ 
                [{ value: "none", label : "None" }].concat(roles.map(role => {
                  return {
                    value: role.id,
                    label: role.name
                  }
                }))
              }
            />
          }
          <Switch label="Fixed select amount?" checked={fixedSelectAmount} onChange={(event) => {
            const checked = event.currentTarget.checked;
            if (!checked) {
              if (form.values.maxChoices <= 1) {
                form.values.maxChoices = form.values.maxChoices + 1;
              }
              form.values.minChoices = form.values.maxChoices - 1
              setMinChoices(form.values.minChoices);
              setMaxChoices(form.values.maxChoices);
            }
            setFixedSelectAmount(checked)
          }}/>
          {
            fixedSelectAmount ? 
            <Slider p="md" min={1} max={5} value={maxChoices}
              marks={[
                { value: 1, label: '1' },
                { value: 2, label: '2' },
                { value: 3, label: '3' },
                { value: 4, label: '4' },
                { value: 5, label: '5' },
              ]}
              onChange={(value) => {
                form.values.minChoices = value;
                form.values.maxChoices = value;
                setMinChoices(value);
                setMaxChoices(value);
              }}
            /> : <RangeSlider p="md" min={1} max={5} minRange={1} value={[minChoices, maxChoices]}
              marks={[
                { value: 1, label: '1' },
                { value: 2, label: '2' },
                { value: 3, label: '3' },
                { value: 4, label: '4' },
                { value: 5, label: '5' },
              ]}
              onChange={([min, max]) => {
                form.values.minChoices = min;
                form.values.maxChoices = max;
                setMinChoices(min);
                setMaxChoices(max);
              }}
            />
          }
          <Button onClick={() =>
            form.addListItem('entries', { name: '', description: "", emoji: "" })
          } disabled={form.values.entries.length >= 5}>
            Add Entry
          </Button>

          {
            form.values.entries.length > 0 && 
            <>
              <Stack>
                { fields }
              </Stack>
              <Divider />
            </>
          }
          <Group position="right" mt="md">
            <Button type="submit" color="green">Update Poll</Button>
          </Group>
        </Stack>
        </form>
      </Paper>
    </div>
  );
};

export default PollEditor;
