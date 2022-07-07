import nc from "next-connect";

export default nc({}).get((req, res) => {
  res.status(200).json({
    get_endpoints: [
      "/:guildid",
      "/:guildid/admins",
      "/:guildid/roles",
      "/:guildid/polls",
    ],
    put_endpoints: ["/:guildid", "/:guildid/admins/:userid"],
    delete_endpoints: ["/:guildid", "/:guildid/admins/:userid"],
  });
});
