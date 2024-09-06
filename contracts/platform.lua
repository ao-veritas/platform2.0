-- local utils = require(".utils")
local json = require("json")
-- local constants = require("helpers.constants")
local verifiedBridgedToken = require("utils.bridgedTokens")
base64 = require(".base64")
sqlite3 = require("lsqlite3")
db = db or sqlite3.open_memory()
AOTOKENID = "abc"
    
-- DROP TABLE IF EXISTS Users;
db:exec([[
    DROP TABLE IF EXISTS Transactions;
    DROP TABLE IF EXISTS Projects;
    CREATE TABLE IF NOT EXISTS Users(
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        UserID TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS Transactions (
        Timestamp TEXT, 
        TransID TEXT,
        UserID TEXT,
        TokenID TEXT,
        Quantity TEXT,
        ProjectID TEXT,
        Status TEXT,
        Type TEXT
    );
    CREATE TABLE IF NOT EXISTS Projects (
        ProjectID TEXT,
        ProjectTokenID TEXT,
        TaoEthStaked INTEGER
    )
]])

function sql_run(query, ...)
    print("enter sql run1")
    local m = {}
    local stmt = db:prepare(query)
    print(stmt);
    if stmt then
        -- print("enter stmt1")
        local bind_res = stmt:bind_values(...)
        assert(bind_res, "❌[bind error] " .. db:errmsg())
        for row in stmt:nrows() do
            table.insert(m, row)
            -- print("enter for loop1")
        end
        stmt:finalize()
    end
    return m
end

function sql_write(query, ...)
    print("enter sql write")
    local stmt = db:prepare(query)
    print(stmt)
    if stmt then
        print("enter stmt2")
        local bind_res = stmt:bind_values(...)
        print(bind_res)
        assert(bind_res, "❌[bind error] " .. db:errmsg())
        local step = stmt:step()
        print(step)
        assert(step == sqlite3.DONE, "❌[write error] " .. db:errmsg())
        stmt:finalize()
    end
    print("before return")
    return db:changes()
end

-- NOTE: cant update totals, what if ao triggering notif, is last 5 min wala calculation and more has come since

-- REGISTER USER (3rd party? lol no)
Handlers.add(
    "RegisterUser",
    Handlers.utils.hasMatchingTag("Action", "Register-User"),
    function(msg)
        local tags = msg.Tags
         -- CHECK USER TABLE, if not then add
        local exists = sql_run([[SELECT EXISTS (SELECT 1 FROM Users WHERE UserID = (?)) AS value_exists;]], tags.UserID);
        for _, i in ipairs(exists) do
            print(i.value_exists);
            if i.value_exists>0 then
                Handlers.utils.reply("User already Exists")(msg);
                return;
            else
                local write_res = sql_write([[INSERT INTO Users (UserID) VALUES (?)]], tags.UserID)
            end
        end
        -- if not Users[msg.From] then Users[msg.From] = "0" end
        -- ADD OTHER INFO
    end
)


-- STAKE BY USER
Handlers.add(
    "Staked",
    Handlers.utils.hasMatchingTag("Action", "Credit-Notice") and Handlers.utils.hasMatchingTag("X-Action", "Staked"),
    function(msg)
        print("CREDIT NOTICE ENTERED STAKED")
        local tags = msg.Tags 
        -- -- CHECK USER TABLE, if not then add or send notif to register (?)
        local user_exists = sql_run([[SELECT EXISTS (SELECT 1 FROM Users WHERE UserID = (?)) AS value_exists;]], tags.Sender);
        for _, i in ipairs(user_exists) do
            print(i.value_exists);
            if i.value_exists>0 then
                Handlers.utils.reply("User already Exists")(msg);
                break;
             else
                local write_res = sql_write([[INSERT INTO Users (UserID) VALUES (?)]], tags.Sender)
            end
        end
        -- bridged token id = msg.From check against verified tokens
        local found = false
        for k, v in pairs(verifiedBridgedToken) do
            print("IN CHECK BRIDGED")
            if v == msg.From then
                found = true
                print("FOUND TRUE")
                break
            end
        end
        if not found then
                -- SHALL WE BE SENDING SECURITY IMPLEMENTATIONS, cause what if its a manual message, but do we care if someone ahs access to a token? will we be holding?
            ao.send({
                Target = msg.From,
                Action = "Transfer",
                Recipient = msg.Sender,
                Quantity = msg.Quantity,
                ["X-Data"] = "not bridged token"
            })
                -- SHALL I BE CREATING ANOTHER TRANSACTION OF SENDING BACK (?)
            print("IN NOT FOUND")
            return 
        end
        -- log the info
        -- print("TEST PRINTS")
        local projectID
        for k,v in pairs(msg.Tags) do 
            if k == "X-ProjectID" then
                projectID = v
                -- check if project exists, add if not
                    local project_exists = sql_run([[SELECT EXISTS (SELECT 1 FROM Projects WHERE ProjectID = (?)) AS value_exists;]], projectID);
                    for _, i in ipairs(project_exists) do
                        print(i.value_exists);
                        if i.value_exists>0 then
                            Handlers.utils.reply("Proj already Exists")(msg);
                            break;
                         else
                            local write_res = sql_write([[INSERT INTO Projects (ProjectID, ProjectTokenID, TaoEthStaked) VALUES (?, ?, ?)]], projectID, "nil", 0)
                        end
                    end
                -- print("projectID" .. projectID .. ":" .. type(projectID))
                break
            end
        end
        local logTrans = sql_write([[INSERT INTO Transactions (Timestamp, TransID, UserID, TokenID, Quantity, ProjectID, Status, Type) VALUES (?, ?, ?, ?, ?, ?, ?, ? );]], tostring(msg.Timestamp), msg.Id, tags.Sender, msg.From, tags.Quantity, projectID, "fulfilled", "btf")
        local currentTotal = sql_run([[SELECT TaoEthStaked FROM Projects WHERE ProjectID = (?)]], projectID)
        local newTotal
        for _, i in ipairs(currentTotal) do
            newTotal = tonumber(i.TaoEthStaked) + tonumber(tags.Quantity)
        end
        print("new total: " .. newTotal);
        local changeTotal = sql_write([[UPDATE Projects SET TaoEthStaked = ? WHERE ProjectID = ? ]], newTotal, projectID)
        -- local project_change = sql_write([[INSERT INTO Projects (TaoEthStaked) VALUES (?)]], )    
        -- store to project = X-ProjectID (?)
            -- ADD TO TOTALS function call
                -- if i trvaerse entire transactins again and again, not optimized
        -- end
        -- TRIGGER NOTIF but from my process, NO CRON IT. (?)
    end
)

-- -- AO RECIEVE
-- Handlers.add(
--     "IncomingAO",
--     Handlers.utils.hasMatchingTag("Action", "Credit-Notice") and Handlers.utils.hasMatchingTag("From-Process", "nA_AOvjSqUvwqwO4Loc4oQZah0kzINm45cQ9Z0NZjq8"),
--     function(msg)
--         local logTrans = sql_write([[INSERT INTO Transactions (Timestamp, TransID, UserID, TokenID, Quantity, ProjectID, Status, Type) VALUES (?, ?, ?, ?, ?, ?, ?, ? );]], tostring(msg.Timestamp), msg.Id, tags.Sender, msg.From, tags.Quantity, "nil", "fulfilled", "atf")
--         -- check against bridged tokens and yield, totaled from BRIDGED TOKENS DB
--         -- Send alert if not right
--         -- Send Notif According to Projects DB calc yield, Action = Notif, Amount = calc below
--             -- traverse totals table, for each projectID
--                 ao.send(
--                     Target = projectID,
--                     Action = Notif,
--                     Quantity = TOTALS.projectID.AOQuantity,
--                 )
--                 -- log the info
--                     -- TRANSACTIONS.amount= TOTALS.projectID.AOQuantity, 
--                     -- TRANSACTIONS.userID= pid, 
--                     -- TRANSACTIONS.tokenID = ptid, 
--                     -- TRANSACTIONS.projectID = pid
--                     -- TRANSACTION.type = ptf
--                     -- TRANSACTION.status = pending
--     end
-- )

-- -- NOTIF FOR PROJECT (for my side CRON IT CRON IT)
-- Handlers.add(
--     "Notification",
--     Handlers.utils.hasMatchingTag("Action", "Notif"),
--     function(msg)
--         -- check if i sent the notif cron
--         if msg.From == platformID and not msg.Cast then -- (?) WHAT IS CAST WHY DO I NEED TO CHECK FOR IT
--             ao.send(
--                 Target = ptid,
--                 Action = "Transfer",
--                 Recipient = platformID,
--                 Quantity = msg.Tags.Quantity
--             )
--         end
--     end
-- )

-- --PToken Recieved
-- Handlers.add(
--     "IncomingPToken",
--     Handlers.utils.hasMatchingTag("Action", "Credit-Notice") and Handlers.utils.hasMatchingTag("From-Process", "ProjectToken"),
--     function(msg)
--         -- check against project tokens ID (frm project DB)
--             --iterate through PROJECTS TABLE
--                 -- if ptokenid exists, 
--                     -- iterate through usersStaked on the project
--                     -- distribute accordingly
--                         -- calculate quantity
--                         ao.send(
--                             Target = PROJECT.projectID.pTokenID,
--                             Action = "Transfer",
--                             Recipient = PROJECT.projectID.userID,
--                             Quantity = quantity
--                         )
--                     -- check totals and send ao to project
--                         -- calculate quantity
--                         ao.send(
--                             Target = AOTOKENID,
--                             Action = "Transfer",
--                             Recipient = ProjectID
--                             Quantity = quantity
--                         )
--                         -- TRANSACTION.status = fullfilled
--                 -- else end
--         -- Send to User (frm user db)
--     end
-- )

-- Handlers.add(
--     "UnStake",
--     Handlers.utils.hasMatchingTag("Action", "Un-Stake"),
--     function(msg)
--         -- check against existing users
--         if not Users[msg.From] then
        
--         else
--         -- Send back Bridged token from FE
--             ao.send(
--                 Target = msg.Tags.bridgedID,
--                 Action = "Transfer",
--                 Recipient = msg.From,
--                 Quantity = msg.Tags.Quantity,
--                 ["X-Action"] = "Unstaking"
--             )
--         end
--     end
-- )

-- Handlers.add(
--     "UnStaked",
--     Handlers.utils.hasMatchingTag("Action", "Debit-Notice") and Handlers.utils.hasMatchingTag("x-Action", "Unstaking"),
--     function(msg)
--         -- check against bridged token IDs
--         if not Bridged[msg.From] then
--             ao.send(
--                 Target = msg.Sender,
--                 Data = "Not a verified Token"
--             )
--             -- SHALL WE BE SENDING SECURITY IMPLEMENTATIONS (?)
--             ao.send(
--                 Target = msg.From,
--                 Action = "Transfer",
--                 Recipient = msg.Sender,
--                 Quantity = msg.Quantity
--             )
--         else
--             -- log the info
--                 -- TRANSACTIONS.amount= msg.Quantity, 
--                 -- TRANSACTIONS.userID= msg.Sender, 
--                 -- TRANSACTIONS.bridgedID = msg.From, 
--                 -- TRANSACTIONS.projectID = msg.["X-projectID"]
--                 -- TRANSACTION.type = credit
--                 -- store to project = X-ProjectID (?)
--             -- ADD TO TOTALS
--                 -- agar we doing projectID
--                     -- TOTALS.projectID.bridgedID.Quantity
--         end
--     end
-- )

