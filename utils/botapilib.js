import {basePath} from "next.config";

const api_url = `${basePath}/api`

export function getRoles(token, guildId) {
  return fetch(
    `${api_url}/guilds/${guildId}/roles`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    },
  ).then((res) => res.json());
}

export function getPoll(token, pollId) {
  return fetch(`${api_url}/polls/${pollId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
}

export function patchPoll(token, pollId, changes) {
  return fetch(`${api_url}/polls/${pollId}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
    credentials: "include",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
}

export function getAuthorPolls(token, authorId) {
  return fetch(
    `${api_url}/polls/filter?authorId=${authorId}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    },
  ).then((res) => res.json());
}

export default {getRoles, getPoll, patchPoll, getAuthorPolls};
