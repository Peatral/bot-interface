import nc from "next-connect";

export default nc({}).get((req, res) => {
  res.json({
    get_endpoints: ["/users", "/guilds", "/polls"],
  });
});
