// import fetchCount from "./utils/messageCountQueries";
// import balances from "./utils/tokenQueries";

const fetchCount = require("./utils/messageCountQueries");

const main = () => {
    // balances("8gcUYtSBI8iqQiq_YnIzPT_svY-hwEL3_gTWz0ps--I");
    fetchCount();
}

main();