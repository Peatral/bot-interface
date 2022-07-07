import nc from "next-connect";

export default nc({}).get((req, res) => {
  res.status(200).json({
    get_endpoints: ["/:pollid", "/filter", "/:pollid/votes"],
  });
});
