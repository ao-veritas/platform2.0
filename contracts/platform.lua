local utils = require(".utils")
local json = require("json")
-- local constants = require("helpers.constants")
local verifiedBridgedToken = require("utils.bridgedTokens")

-- STAKE BY USER
Handlers.add(
    "Stake",
    Handlers.utils.hasMatchingTag("Action", "Credit-Notice") and Handlers.utils.hasMatchingTag("X-Action", "Stake"),
    function(msg)
        -- bridged token id = msg.From check against verified tokens
        -- amount= msg.Quantity, userid= msg.Sender, store to project = X-ProjectID
    end
)

-- AO RECIEVE
Handlers.add(
    "IncomingAO",
    Handlers.utils.hasMatchingTag("Action", "Credit-Notice") and Handlers.utils.hasMatchingTag("From-Process", "AO_PROCESS_ID"),
    function(msg)
        -- check against bridged tokens and yield, totaled from BRIDGED TOKENS DB
        -- Send alert if not right
        -- Send Notif According to Projects DB calc yield
            -- Action = Notif, Amount = calc above
    end
)

-- NOTIF FOR PROJECT ONLYYYYY
-- Handlers.add(
--     "Notification",
--     Handlers.utils.hasMatchingTag("Action", "Notif"),
--     function(msg)

--     end
-- )

--PToken Recieved
Handlers.add(
    "IncomingPToken",
    Handlers.utils.hasMatchingTag("Action", "Credit-Notice"),
    function(msg)
        -- check against project tokens ID (frm project DB)
        -- Send to User (frm user db)
    end
)

Handlers.add(
    "UnStake",
    Handlers.utils.hasMatchingTag("Action", "Un-Stake"),
    function(msg)
        -- check against existing users
        -- projectID, amount, bridged token ID
        -- Send back Bridged token
    end
)

Handlers.add(
    "UnStaked",
    Handlers.utils.hasMatchingTag("Action", "Debit-Notice") and Handlers.utils.hasMatchingTag("x-Action", "Unstaking"),
    function(msg)
        -- check against bridged token IDs
        -- change User: msg.Recipient, Project: X-ProjectID, Bridged Token: msg.From
    end
)

