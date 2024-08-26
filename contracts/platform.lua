local utils = require(".utils")
local json = require("json")
-- local constants = require("helpers.constants")
local verifiedBridgedToken = require("utils.bridgedTokens")
local db = require("lsqlite3").open_memory()

AOTOKENID = "abc"

db:exec[[CREATE TABLE ]]

-- DUMMY SQL TABLE IDK
-- USER:
--     userID
-- --    transactions table (?)
-- PROJECT:
--     projectID
--     pTokenID
--     usersStaked
-- TRANSACTIONS:
--     {
--         time(?)
--         userID
--         bridgedID
--         Quantity
--         projectID
--         type
--     }
-- BRIDGEDTOKENS: 
--     AOETH: id
--     AOSOL: id
-- TOTALS:
--     shall this be on the pid or bid (?)
--     projectID.bridgedID.Quantity


-- NOTE: cant update totals, what if ao triggering notif, is last 5 min wala calculation and more has come since




-- REGISTER USER (3rd party? lol no)
Handlers.add(
    "RegisterUser",
    Handlers.utils.hasMatchingTag("Action", "Register-User"),
    function(msg)
        -- local tags = msg.Tags
         -- CHECK USER TABLE, if not then add
        if not Users[msg.From] then Users[msg.From] = "0" end
        -- ADD OTHER INFO
    end
)

Handlers.add(
    "Stake",
    Handlers.utils.hasMatchingTag("Action", "Stake"),
    function(msg)
        -- CHECK USER TABLE, if not then add or send notif to register (?)
        if not Users[msg.Sender] then Users[msg.Sender] = "0" end 
        ao.send(
            Target = msg.Tags.bridgedID,
            Action = "Transfer",
            Recipient = msg.From,
            Quantity = msg.Tags.Quantity,
            ["X-Action"] = "Stake"
        )
    end
)

-- STAKE BY USER
Handlers.add(
    "Staked",
    Handlers.utils.hasMatchingTag("Action", "Credit-Notice") and Handlers.utils.hasMatchingTag("X-Action", "Stake"),
    function(msg)
        -- CHECK USER TABLE, if not then add or send notif to register (?)
        if not Users[msg.Sender] then Users[msg.Sender] = "0" end
        -- bridged token id = msg.From check against verified tokens
        if not Bridged[msg.From] then
            ao.send(
                Target = msg.Sender,
                Data = "Not a verified Token"
            )
            -- SHALL WE BE SENDING SECURITY IMPLEMENTATIONS (?)
            ao.send(
                Target = msg.From,
                Action = "Transfer",
                Recipient = msg.Sender,
                Quantity = msg.Quantity
            )
        else
            -- log the info
                -- TRANSACTIONS.amount= msg.Quantity, 
                -- TRANSACTIONS.userID= msg.Sender, 
                -- TRANSACTIONS.bridgedID = msg.From, 
                -- TRANSACTIONS.projectID = msg.["X-projectID"]
                -- TRANSACTION.type = credit
                -- store to project = X-ProjectID (?)
            -- ADD TO TOTALS
                -- agar we doing projectID
                    -- TOTALS.projectID.bridgedID.Quantity
        end
        -- TRIGGER NOTIF but from my process, NO CRON IT. (?)
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

-- NOTIF FOR PROJECT CRON IT CRON IT
Handlers.add(
    "Notification",
    Handlers.utils.hasMatchingTag("Action", "Notif"),
    function(msg)
        -- check if i sent the notif cron
        if msg.From == ao.id and not msg.Cast then -- (?) WHAT IS CAST WHY DO I NEED TO CHECK FOR IT
            -- SEND RIGHT NOTIFS
            -- Aggregations of Transaction Table
            -- Iterate Projects TABLE
                -- for projectID
                    -- TOTALS.projectID

        end
    end
)

--PToken Recieved
Handlers.add(
    "IncomingPToken",
    Handlers.utils.hasMatchingTag("Action", "Credit-Notice"),
    function(msg)
        -- check against project tokens ID (frm project DB)
            --iterate through PROJECTS TABLE
                -- if ptokenid exists, 
                    -- iterate through usersStaked on the project
                    -- distribute accordingly
                        -- calculate quantity
                        ao.send(
                            Target = PROJECT.projectID.pTokenID,
                            Action = "Transfer",
                            Recipient = PROJECT.projectID.userID,
                            Quantity = quantity
                        )
                    -- check totals and send ao to project
                        -- calculate quantity
                        ao.send(
                            Target = AOTOKENID,
                            Action = "Transfer",
                            Recipient = ProjectID
                            Quantity = quantity
                        )
                -- else end
        -- Send to User (frm user db)
    end
)

Handlers.add(
    "UnStake",
    Handlers.utils.hasMatchingTag("Action", "Un-Stake"),
    function(msg)
        -- check against existing users
        if not Users[msg.From] then
        
        else
        -- Send back Bridged token
            ao.send(
                Target = msg.Tags.bridgedID,
                Action = "Transfer",
                Recipient = msg.From,
                Quantity = msg.Tags.Quantity,
                ["X-Action"] = "Unstaking"
            )
        end
    end
)

Handlers.add(
    "UnStaked",
    Handlers.utils.hasMatchingTag("Action", "Debit-Notice") and Handlers.utils.hasMatchingTag("x-Action", "Unstaking"),
    function(msg)
        -- check against bridged token IDs
        if not Bridged[msg.From] then
            ao.send(
                Target = msg.Sender,
                Data = "Not a verified Token"
            )
            -- SHALL WE BE SENDING SECURITY IMPLEMENTATIONS (?)
            ao.send(
                Target = msg.From,
                Action = "Transfer",
                Recipient = msg.Sender,
                Quantity = msg.Quantity
            )
        else
            -- log the info
                -- TRANSACTIONS.amount= msg.Quantity, 
                -- TRANSACTIONS.userID= msg.Sender, 
                -- TRANSACTIONS.bridgedID = msg.From, 
                -- TRANSACTIONS.projectID = msg.["X-projectID"]
                -- TRANSACTION.type = credit
                -- store to project = X-ProjectID (?)
            -- ADD TO TOTALS
                -- agar we doing projectID
                    -- TOTALS.projectID.bridgedID.Quantity
        end
    end
)

