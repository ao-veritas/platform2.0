-- l13OiZyp7T5YpmOqofjHRGyCbrpllLZp4HOyfa2WLPQ
-- local utils = require(".utils")
local json = require("json")
-- local constants = require("helpers.constants")
local verifiedBridgedToken = require("utils.bridgedTokens")
base64 = require(".base64")
sqlite3 = require("lsqlite3")
db = db or sqlite3.open_memory()
AOTOKENID = "abc"
    
-- DROP TABLE IF EXISTS Transactions;
-- DROP TABLE IF EXISTS Users;
-- DROP TABLE IF EXISTS Projects;
-- DROP TABLE IF EXISTS UserStakes;

db:exec([[

    CREATE TABLE IF NOT EXISTS Users(
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        UserID TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS UserStakes (
        UserID TEXT,
        ProjectID TEXT,
        TokenID TEXT,
        TotalStaked DEFAULT 0,
        PRIMARY KEY (UserID, ProjectID, TokenID)
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
    print("enter sql run")
    local m = {}
    local stmt = db:prepare(query)
    -- print("run stmt:" .. tostring(stmt));
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
    -- print("write stmt : " .. tostring(stmt))
    if stmt then
        -- print("enter write stmt")
        local bind_res = stmt:bind_values(...)
        assert(bind_res, "❌[bind error] " .. db:errmsg())
        local step = stmt:step()
        assert(step == sqlite3.DONE, "❌[write error] " .. db:errmsg())
        stmt:finalize()
    end
    -- print("before return")
    return db:changes()
end

-- NOTE: cant update totals, what if ao triggering notif, is last 5 min wala calculation and more has come since

-- REGISTER PROJECT
Handlers.add(
    "RegisterProject",
    Handlers.utils.hasMatchingTag("Action", "Register-Project"),
    function(msg)
        print("enter Register project handler")
        local tags = msg.Tags
         -- CHECK USER TABLE, if not then add
        local exists = sql_run([[SELECT EXISTS (SELECT 1 FROM Projects WHERE ProjectID = (?)) AS value_exists;]], tags.projectID);
        for _, i in ipairs(exists) do
            print(i.value_exists);
            if i.value_exists>0 then
                Handlers.utils.reply("Project already Exists")(msg);
                return;
            else
                local write_res = sql_write([[INSERT INTO Projects (ProjectID, ProjectTokenID, TaoEthStaked) VALUES (?, ?, ?)]], tags.projectID, tags.projectTokenID, 0)
            end
        end
        -- if not Users[msg.From] then Users[msg.From] = "0" end
        -- ADD OTHER INFO
        print("exit Register project handler")
    end
)

-- REGISTER USER
Handlers.add(
    "RegisterUser",
    Handlers.utils.hasMatchingTag("Action", "Register-User"),
    function(msg)
        print("enter Register user handler")
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
        -- check From against verified tokens
        local found = false
        for k, v in pairs(verifiedBridgedToken) do
            -- print("IN CHECK BRIDGED")
            if v == msg.From then
                found = true
                -- print("FOUND TRUE")
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
            -- print("IN NOT FOUND")
            return 
        end
        -- log the info
        local projectID
        for k,v in pairs(msg.Tags) do 
            if k == "X-ProjectID" then
                projectID = v
                -- check if project exists, add if not
                    local project_exists = sql_run([[SELECT EXISTS (SELECT 1 FROM Projects WHERE ProjectID = (?)) AS value_exists;]], projectID);
                    for _, i in ipairs(project_exists) do
                        print(i.value_exists);
                        if i.value_exists>0 then
                            -- Handlers.utils.reply("Proj already Exists")(msg);
                            break;
                         else
                            local write_res = sql_write([[INSERT INTO Projects (ProjectID, ProjectTokenID, TaoEthStaked) VALUES (?, ?, ?)]], projectID, "nil", 0)
                        end
                    end
                break
            end
        end
        local exists = sql_run([[SELECT TotalStaked FROM UserStakes WHERE UserID = ? AND ProjectID = ? AND TokenID = ?]], tags.Sender, projectID, msg.From)
        if #exists > 0 then
            -- Update existing stake
            local currentTotal = tonumber(exists[1].TotalStaked)
            local newTotal = currentTotal + tonumber(tags.Quantity)
            sql_write([[UPDATE UserStakes SET TotalStaked = ? WHERE UserID = ? AND ProjectID = ? AND TokenID = ?]], tostring(newTotal), tags.Sender, projectID, msg.From)
        else
            -- Insert new stake entry
            sql_write([[INSERT INTO UserStakes (UserID, ProjectID, TokenID, TotalStaked) VALUES (?, ?, ?, ?)]], tags.Sender, projectID, msg.From, tostring(tags.Quantity))
        end
        local logTrans = sql_write([[INSERT INTO Transactions (Timestamp, TransID, UserID, TokenID, Quantity, ProjectID, Status, Type) VALUES (?, ?, ?, ?, ?, ?, ?, ? );]], tostring(msg.Timestamp), msg.Id, tags.Sender, msg.From, tags.Quantity, projectID, "fulfilled", "btf")
        local currentTotal = sql_run([[SELECT TaoEthStaked FROM Projects WHERE ProjectID = (?)]], projectID)
        local newTotal
        for _, i in ipairs(currentTotal) do
            newTotal = tonumber(i.TaoEthStaked) + tonumber(tags.Quantity)
        end
        -- print("new total: " .. newTotal);
        local changeTotal = sql_write([[UPDATE Projects SET TaoEthStaked = ? WHERE ProjectID = ? ]], newTotal, projectID)
        -- TRIGGER NOTIF but from my process, NO CRON IT. (?)
    end
)

-- AO RECIEVE
Handlers.add(
    "AOReciever",
    function(msg)
        local fromProcess
        for k,v in pairs(msg.Tags) do 
            if k == "From-Process" then
                fromProcess = v
            end
        end
        return msg.Action == "Credit-Notice" and  fromProcess == "hB4KnOL8H6VY8RjhNp5kXZG5QSssK9f0ZteVUSb1Uv4"
    end,
    function(msg)
        print("IN AO RECIEVER")
        local tags = msg.Tags
        local logTrans = sql_write([[INSERT INTO Transactions (Timestamp, TransID, UserID, TokenID, Quantity, ProjectID, Status, Type) VALUES (?, ?, ?, ?, ?, ?, ?, ? );]], tostring(msg.Timestamp), msg.Id, tags.Sender, msg.From, tags.Quantity, "nil", "fulfilled", "atf")
        print("AFTER TRANS CREATED")
        -- check against bridged tokens and yield, totaled from BRIDGED TOKENS DB
        -- Send alert if not right
        -- Send Notif According to Projects DB calc yield, Action = Notif, Amount = calc below
            -- traverse totals table, for each projectID
            local projectsTable = sql_run([[SELECT * FROM Projects]])
            -- -- print(projectsTable)
            local ptokenToSendQuantity =0
            for _, i in ipairs(projectsTable) do
                -- some formulae to calculate 
                print(i)
                ptokenToSendQuantity = ptokenToSendQuantity + i.TaoEthStaked --CALCULATE FORMULA (?)
                print("tao:" .. i.TaoEthStaked)
                print("new ptoken to send:" .. tostring(ptokenToSendQuantity))
                print("projectid" .. i.ProjectID)
                ao.send({
                    Target = i.ProjectID,
                    Action = "Notif",
                    Quantity = tostring(ptokenToSendQuantity),
                })
                print("NOTIF SENT")
            end
                -- log the info
                    -- TRANSACTIONS.amount= TOTALS.projectID.AOQuantity, 
                    -- TRANSACTIONS.userID= pid, 
                    -- TRANSACTIONS.tokenID = ptid, 
                    -- TRANSACTIONS.projectID = pid
                    -- TRANSACTION.type = ptf
                    -- TRANSACTION.status = pending
    end
)

--PToken Recieved
-- Handlers.add(
--     "IncomingPToken",
--     function(msg)
--         print("ENTER RETURN FOR PTOKEN")
--         local fromProcess
--         for k,v in pairs(msg.Tags) do 
--             print("step1")
--             if k == "From-Process" then
--                 print("step2")
--                 fromProcess = v
--                 break
--             end
--         end
--         print(fromProcess)
--         local project_exists = sql_run([[SELECT EXISTS (SELECT 1 FROM Projects WHERE ProjectTokenID = (?)) AS value_exists;]], fromProcess);
--         print("step3")
--         for _, i in ipairs(project_exists) do
--             print("step4")
--             print(i.value_exists);
--             if i.value_exists>0 and msg.Action == "Credit-Notice" then
--                 print("step5.1")
--                 -- Handlers.utils.reply("Proj already Exists")(msg);
--                 return true
--             else
--                 print("step5.2")
--                 return false
--             end
--         end 
--     end,
--     function(msg)
--         print("ENTER PTOKEN RECIEVE")
--         local tags = msg.Tags
--         local logTrans = sql_write([[INSERT INTO Transactions (Timestamp, TransID, UserID, TokenID, Quantity, ProjectID, Status, Type) VALUES (?, ?, ?, ?, ?, ?, ?, ? );]], tostring(msg.Timestamp), msg.Id, tags.Sender, msg.From, tags.Quantity, tags.Sender, "fulfilled", "ptf")
--             -- iterate through usersStaked on the project
--             -- distribute accordingly
--                 -- calculate quantity
--             --     ao.send(
--             --         Target = PROJECT.projectID.pTokenID,
--             --         Action = "Transfer",
--             --         Recipient = PROJECT.projectID.userID,
--             --         Quantity = quantity
--             --     )
--             -- -- check totals and send ao to project
--             --     -- calculate quantity
--             --     ao.send(
--             --         Target = AOTOKENID,
--             --         Action = "Transfer",
--             --         Recipient = ProjectID
--             --         Quantity = quantity
--             --     )
--                 -- TRANSACTION.status = fullfilled
--         -- else end
--         -- Send to User (frm user db)
--     end
-- )

--PToken Received Handler
Handlers.add(
    "IncomingPToken",
    function(msg)
        print("ENTER RETURN FOR PTOKEN")
        local fromProcess
        for k, v in pairs(msg.Tags) do
            if k == "From-Process" then
                fromProcess = v
                break
            end
        end

        -- Check if the token belongs to a registered project
        local project_exists = sql_run([[SELECT EXISTS (SELECT 1 FROM Projects WHERE ProjectTokenID = (?)) AS value_exists;]], fromProcess)
        for _, i in ipairs(project_exists) do
            if i.value_exists > 0 and msg.Action == "Credit-Notice" then
                return true
            else
                print("EXIT FALSE RETURN FOR PTOKEN")
                return false
            end
        end
    end,
    function(msg)
        print("ENTER PTOKEN RECEIVE")
        local tags = msg.Tags
        local fromProcess = tags["From-Process"]

        -- Log the incoming transaction
        local logTrans = sql_write([[INSERT INTO Transactions (Timestamp, TransID, UserID, TokenID, Quantity, ProjectID, Status, Type) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ? );]], 
                                    tostring(msg.Timestamp), msg.Id, tags.Sender, msg.From, tags.Quantity, tags.Sender, "fulfilled", "ptf")

        -- Get the list of users who have staked in the project
        local stakers = sql_run([[SELECT UserID, TotalStaked FROM UserStakes WHERE ProjectID = (?)]], tags.Sender)
        print(stakers)
        -- Distribute the incoming tokens based on user stakes
        local totalStake = 0
        print("before mapping stakers")
        for _, stake in ipairs(stakers) do
            print("in stakes calc total")
            totalStake = totalStake + tonumber(stake.TotalStaked)
            print("total: ".. tostring(totalStake))
            print("stake,total: " .. tostring(stake.TotalStaked))
        end
        print("after mapping stakers")

        if totalStake > 0 then
            print("in total >0 stakers")
            for _, stake in ipairs(stakers) do
                print("in total >0 stakers ka for loop")
                local userShare = math.floor((tonumber(stake.TotalStaked) / totalStake) * tonumber(tags.Quantity))
                print("for user:" .. stake.UserID)
                print("userShare:" .. tostring(userShare))
                -- Send tokens to each staker
                ao.send({
                    Target = msg.From,
                    Action = "Transfer",
                    Recipient = stake.UserID,
                    Quantity = tostring(userShare),
                    ["X-Data"] = "stake distribution"
                })
                print("AFTER sta to user transfer sent")
                -- Optionally log the stake distribution as a transaction
                -- local logDistTrans = sql_write([[INSERT INTO Transactions (Timestamp, TransID, UserID, TokenID, Quantity, ProjectID, Status, Type) 
                --                                 VALUES (?, ?, ?, ?, ?, ?, ?, ? );]], 
                --                                 tostring(msg.Timestamp), msg.Id, stake.UserID, msg.From, tostring(userShare), tags.Sender, "fulfilled", "ptf-distribution")
            end
            print("after total >0 stakers ka for loop")
 
        end

        print("PTOKEN RECEIVE HANDLER COMPLETED")
    end
)


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

