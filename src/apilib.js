export function getRoles(token, guildId) {
  return fetch(`${process.env.REACT_APP_BACKEND_URL}/guilds/${guildId}/roles`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  })
  .then(res => res.json());
}

export function getPoll(token, pollId) {
  return fetch(`${process.env.REACT_APP_BACKEND_URL}/polls/${pollId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  })
  .then(res => res.json());
}

export function patchPoll(token, pollId, changes) {
  return fetch(`${process.env.REACT_APP_BACKEND_URL}/polls/${pollId}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
    credentials: "include",
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
}

export function getAuthorPolls(token, authorId) {
  return fetch(`${process.env.REACT_APP_BACKEND_URL}/polls/author/${authorId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  })
  .then(res => res.json());
}