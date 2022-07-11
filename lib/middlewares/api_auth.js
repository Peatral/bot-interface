const {verifyUser} = require("@utils/authenticate");
const {checkDBConnection} = require("@utils/dbutils");
const {default: auths} = require("./auth");

const api_auths = [checkDBConnection, ...auths, verifyUser];

export default api_auths;
