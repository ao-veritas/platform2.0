import { createDataItemSigner, message, result } from "@permaweb/aoconnect";

// RUN A CRON ON THIS WITH PROEJCT LIST
const balances = async({projectID}) => {
    const msg = await dryrun({
        process: projectID,
        tags: [
          { name: "Action", value: "Balances" },
        ],
      });
}

export default balances;