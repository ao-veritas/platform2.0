local utils = require(".utils")
local json = require("json")
-- local constants = require("helpers.constants")
local verifiedBridgedToken = require("utils.bridgedTokens")
local db = require("lsqlite3").open_memory()

AOTOKENID = "abc"

-- db:exec[[CREATE TABLE IF NOT EXISTS Users(
--             README TEXT NOT NULL
-- );]]

-- function sql_run(query, ...)
--     local m = {}
--     local stmt = db:prepare(query)
--     if stmt then
--         local bind_res = stmt:bind_values(...)
--         assert(bind_res, "❌[bind error] " .. db:errmsg())
--         for row in stmt:nrows() do
--             table.insert(m, row)
--         end
--         stmt:finalize()
--     end
--     return m
-- end

-- function sql_write(query, ...)
--     local stmt = db:prepare(query)
--     if stmt then
--         local bind_res = stmt:bind_values(...)
--         assert(bind_res, "❌[bind error] " .. db:errmsg())
--         local step = stmt:step()
--         assert(step == sqlite3.DONE, "❌[write error] " .. db:errmsg())
--         stmt:finalize()
--     end
--     return db:changes()
-- end

-- Handlers.add(
--     "test",
--     Handlers.utils.hasMatchingTag("Action", "Test"),
--     function(msg)
--         local write_res = sql_write([[INSERT INTO Users (README) VALUES (?)]], "heyy")
--         local p = sql_run([[SELECT * FROM Users;]])
--         -- for _, pkg in ipairs(p) do
--         --     print(pkg)
--         -- end
--         print(tostring(p))
--     end
-- )
    


DUMMY SQL TABLE IDK
USER:
    userID
--    transactions table (?)
PROJECT:
    projectID
    pTokenID
    usersStaked
TRANSACTIONS:
    {
        time(?)
        userID
        tokenID
        Quantity
        projectID
        status
        enum type{
            btf -- bridged to fa
            atf -- ao to fa
            ftp -- fa to proj
            ptf -- proj to fa
            ftu -- fa to user
        }
    }
BRIDGEDTOKENS: 
    AOETH: id
    AOSOL: id
TOTALS:
    shall this be on the pid or bid (?)
    projectID.bridgedID.Quantity


NOTE: cant update totals, what if ao triggering notif, is last 5 min wala calculation and more has come since




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
        if not Users[msg.From] then Users[msg.Sender] = "0" end 
        -- FE sends transfer message as below
            -- ao.send(
            --     Target = msg.Tags.bridgedID,
            --     Action = "Transfer",
            --     Recipient = platformID,
            --     Quantity = msg.Tags.Quantity,
            --     ["X-Action"] = "Staked"
            -- )
            -- THIS CREATES A MSG ID
        -- log the info
            -- TRANSACTIONS.ID = msg.Tags.msgID
            -- TRANSACTIONS.amount= msg.Tags.Quantity, 
            -- TRANSACTIONS.userID= msg.From, 
            -- TRANSACTIONS.tokenID = msg.Tags.bridgedID, 
            -- TRANSACTIONS.projectID = msg.["X-ProjectID"]
            -- TRANSACTION.type = btf
            -- TRANSACTION.status = pending
            -- store to project = X-ProjectID (?)
    end
)

-- STAKE BY USER
Handlers.add(
    "Staked",
    Handlers.utils.hasMatchingTag("Action", "Credit-Notice") and Handlers.utils.hasMatchingTag("X-Action", "Staked"),
    function(msg)
        -- CHECK USER TABLE, if not then add or send notif to register (?)
        if not Users[msg.Sender] then Users[msg.Sender] = "0" end
        -- bridged token id = msg.From check against verified tokens
        if not Bridged[msg.From] then
            -- SHALL WE BE SENDING SECURITY IMPLEMENTATIONS (?)
            ao.send(
                Target = msg.From,
                Action = "Transfer",
                Recipient = msg.Sender,
                Quantity = msg.Quantity,
                ["X-Data"] = "not bridged token"
            )
           -- log the info
                -- from credit notic, find the tranfer msgID and find transaction
                    -- if exists, TRANSACTION.status = rejected 
        else
            -- log the info
                -- from credit notic, find the tranfer msgID and find transaction
                    -- TRANSACTION.status = fullfilled 
            -- ADD TO TOTALS function call
                -- if i trvaerse entire transactins again and again, not optimized
        end
        -- TRIGGER NOTIF but from my process, NO CRON IT. (?)
    end
)

-- AO RECIEVE
Handlers.add(
    "IncomingAO",
    -- HOW DO I ENSURE???
    Handlers.utils.hasMatchingTag("Action", "Credit-Notice") and Handlers.utils.hasMatchingTag("From-Process", "AO_PROCESS_ID"),
    function(msg)
        -- check against bridged tokens and yield, totaled from BRIDGED TOKENS DB
        -- Send alert if not right
        -- Send Notif According to Projects DB calc yield, Action = Notif, Amount = calc below
            -- traverse totals table, for each projectID
                ao.send(
                    Target = projectID,
                    Action = Notif,
                    Quantity = TOTALS.projectID.AOQuantity,
                )
                -- log the info
                    -- TRANSACTIONS.amount= TOTALS.projectID.AOQuantity, 
                    -- TRANSACTIONS.userID= pid, 
                    -- TRANSACTIONS.tokenID = ptid, 
                    -- TRANSACTIONS.projectID = pid
                    -- TRANSACTION.type = ptf
                    -- TRANSACTION.status = pending
    end
)

-- NOTIF FOR PROJECT CRON IT CRON IT
Handlers.add(
    "Notification",
    Handlers.utils.hasMatchingTag("Action", "Notif"),
    function(msg)
        -- check if i sent the notif cron
        if msg.From == platformID and not msg.Cast then -- (?) WHAT IS CAST WHY DO I NEED TO CHECK FOR IT
            ao.send(
                Target = ptid,
                Action = "Transfer",
                Recipient = platformID,
                Quantity = msg.Tags.Quantity
            )
        end
    end
)

--PToken Recieved
Handlers.add(
    "IncomingPToken",
    Handlers.utils.hasMatchingTag("Action", "Credit-Notice") and Handlers.utils.hasMatchingTag("From-Process", "ProjectToken"),
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
                        -- TRANSACTION.status = fullfilled
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

