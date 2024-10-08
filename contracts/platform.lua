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
    -- print(query)
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
        print("ENTER RegisterProject handler")
        local tags = msg.Tags
         -- CHECK USER TABLE, if not then add
        print("Check if Exists Run")
        local exists = sql_run([[SELECT EXISTS (SELECT 1 FROM Projects WHERE ProjectID = (?)) AS value_exists;]], tags.projectID);
        for _, i in ipairs(exists) do
            -- print(i.value_exists);
            if i.value_exists>0 then
                Handlers.utils.reply("Project already Exists")(msg);
                return;
            else
                print("Add Project Write") 
                local write_res = sql_write([[INSERT INTO Projects (ProjectID, ProjectTokenID, TaoEthStaked) VALUES (?, ?, ?)]], tags.projectID, tags.projectTokenID, 0)
            end
        end
        print("EXIT Register project handler")
    end
)

-- REGISTER USER
Handlers.add(
    "RegisterUser",
    Handlers.utils.hasMatchingTag("Action", "Register-User"),
    function(msg)
        print("ENTER Register user handler")
        local tags = msg.Tags
         -- CHECK USER TABLE, if not then add
         print("Check if User Exists Run")
        local exists = sql_run([[SELECT EXISTS (SELECT 1 FROM Users WHERE UserID = (?)) AS value_exists;]], tags.UserID);
        for _, i in ipairs(exists) do
            -- print(i.value_exists);
            if i.value_exists>0 then
                Handlers.utils.reply("User already Exists")(msg);
                return;
            else
                print("Add User Write") 
                local write_res = sql_write([[INSERT INTO Users (UserID) VALUES (?)]], tags.UserID)
            end
        end
        print("EXIT Register user handler")
    end
)

-- STAKE BY USER
Handlers.add(
    "Staked",
    Handlers.utils.hasMatchingTag("Action", "Credit-Notice") and Handlers.utils.hasMatchingTag("X-Action", "Staked"),
    function(msg)
        print("ENTER STAKED")
        local tags = msg.Tags 
        -- -- CHECK USER TABLE, if not then add or send notif to register (?)
        print("Check if User Exists Run")
        local user_exists = sql_run([[SELECT EXISTS (SELECT 1 FROM Users WHERE UserID = (?)) AS value_exists;]], tags.Sender);
        for _, i in ipairs(user_exists) do
            -- print(i.value_exists);
            if i.value_exists>0 then
                Handlers.utils.reply("User already Exists")(msg);
                break;
             else
                print("Add User Write") 
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
                print("Check if Project Exists Run") 
                    local project_exists = sql_run([[SELECT EXISTS (SELECT 1 FROM Projects WHERE ProjectID = (?)) AS value_exists;]], projectID);
                    for _, i in ipairs(project_exists) do
                        -- print(i.value_exists);
                        if i.value_exists>0 then
                            -- Handlers.utils.reply("Proj already Exists")(msg);
                            break;
                         else
                            print("Add Project Write") 
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
        print("EXIT STAKED")
        ao.send({
            Target = "hB4KnOL8H6VY8RjhNp5kXZG5QSssK9f0ZteVUSb1Uv4",
            Action = "Transfer",
            Recipient = "l13OiZyp7T5YpmOqofjHRGyCbrpllLZp4HOyfa2WLPQ",
            Quantity = "100000000000000"

        })
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
        print("ENTER AO RECIEVER")
        local tags = msg.Tags
        print("Trasaction add write")
        local logTrans = sql_write([[INSERT INTO Transactions (Timestamp, TransID, UserID, TokenID, Quantity, ProjectID, Status, Type) VALUES (?, ?, ?, ?, ?, ?, ?, ? );]], tostring(msg.Timestamp), msg.Id, tags.Sender, msg.From, tags.Quantity, "nil", "fulfilled", "atf")
        -- check against bridged tokens and yield, totaled from BRIDGED TOKENS DB
        -- Send alert if not right
        -- Send Notif According to Projects DB calc yield, Action = Notif, Amount = calc below
            -- traverse totals table, for each projectID
            local projectsTable = sql_run([[SELECT * FROM Projects]])
            -- -- print(projectsTable)
            local ptokenToSendQuantity =0
            for _, i in ipairs(projectsTable) do
                -- some formulae to calculate 
                -- print(i)
                ptokenToSendQuantity = ptokenToSendQuantity + i.TaoEthStaked --CALCULATE FORMULA (?)
                -- print("tao:" .. i.TaoEthStaked)
                -- print("new ptoken to send:" .. tostring(ptokenToSendQuantity))
                -- print("projectid" .. i.ProjectID)
                ao.send({
                    Target = i.ProjectID,
                    Action = "Notif",
                    Quantity = tostring(ptokenToSendQuantity),
                })
                print("NOTIF SENT")
            end
            print("EXIT AO RECIEVER")
    end
)

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
        print("log trans write")
        local logTrans = sql_write([[INSERT INTO Transactions (Timestamp, TransID, UserID, TokenID, Quantity, ProjectID, Status, Type) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ? );]], 
                                    tostring(msg.Timestamp), msg.Id, tags.Sender, msg.From, tags.Quantity, tags.Sender, "fulfilled", "ptf")

        -- Send AO to project
        ao.send({
            Target = "hB4KnOL8H6VY8RjhNp5kXZG5QSssK9f0ZteVUSb1Uv4",
            Action = "Transfer",
            Recipient = tags.Sender,
            Quantity = tags.Quantity,
            ["X-Action"] = "AOToProject" 
        })

        -- Get the list of users who have staked in the project
        print("find stakers run")
        local stakers = sql_run([[SELECT UserID, TotalStaked FROM UserStakes WHERE ProjectID = (?)]], tags.Sender)

        -- Distribute the incoming tokens based on user stakes
        local totalStake = 0
        for _, stake in ipairs(stakers) do
            totalStake = totalStake + tonumber(stake.TotalStaked)
            -- print("total: ".. tostring(totalStake))
            -- print("stake,total: " .. tostring(stake.TotalStaked))
        end

        if totalStake > 0 then
            -- print("in total >0 stakers")
            for _, stake in ipairs(stakers) do
                -- print("in total >0 stakers ka for loop")
                local userShare = math.floor((tonumber(stake.TotalStaked) / totalStake) * tonumber(tags.Quantity))
                -- print("for user:" .. stake.UserID)
                -- print("userShare:" .. tostring(userShare))
                -- Send tokens to each staker
                ao.send({
                    Target = msg.From,
                    Action = "Transfer",
                    Recipient = stake.UserID,
                    Quantity = tostring(userShare),
                    ["X-Data"] = "stake distribution"
                })
            end 
        end

        print("EXIT PTOKEN RECEIVE HANDLER")
    end
)

-- PToken debit
Handlers.add(
    "PtokenToUserDebit",
    function(msg)
        -- Check if the Action tag is 'Debit-Notice'
        if msg.Action ~= "Debit-Notice" then
            print("Action is not Debit-Notice")
            return false
        end
    
        local fromProcess = msg.From
        local recipient = msg.Tags.Recipient
    
        -- Check if msg.From is a valid ProjectTokenID from the Projects table
        local projectExists = sql_run([[SELECT EXISTS (SELECT 1 FROM Projects WHERE ProjectTokenID = ?) AS value_exists;]], fromProcess)
        local projectValid = false
        for _, result in ipairs(projectExists) do
            if result.value_exists > 0 then
                projectValid = true
                break
            end
        end
        if not projectValid then
            print("Invalid project token")
            return false
        end
    
        -- Check if the recipient exists in the Users table
        local userExists = sql_run([[SELECT EXISTS (SELECT 1 FROM Users WHERE UserID = ?) AS value_exists;]], recipient)
        local recipientValid = false
        for _, result in ipairs(userExists) do
            if result.value_exists > 0 then
                recipientValid = true
                break
            end
        end
        if not recipientValid then
            print("Invalid recipient user")
            return false
        end
    
        -- All validations passed
        print("Validation successful")
        return true
    end,
    function(msg)
        print("entered debit notice")
        local tags = msg.Tags
        local projectIDQuery = sql_run([[SELECT ProjectID FROM Projects WHERE ProjectTokenID = ?]], msg.From)
        local projectID
        -- Check if a project was found
        if #projectIDQuery > 0 then
            -- Return the ProjectID (assuming the first result is what we need)
            projectID = projectIDQuery[1].ProjectID
        end
        local logTrans = sql_write([[
            INSERT INTO Transactions (Timestamp, TransID, UserID, TokenID, Quantity, ProjectID, Status, Type) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        ]], tostring(msg.Timestamp), msg.Id, tags.Recipient, msg.From, tags.Quantity, projectID, "fulfilled", "ftu") 
    end
)

-- UNSTAKE BY USER
Handlers.add(
    "Unstaked",
    Handlers.utils.hasMatchingTag("Action", "Unstaked"),
    function(msg)
        print("UNSTAKE REQUEST RECEIVED")
        local tags = msg.Tags 
        local projectID = tags.ProjectID
        local tokenID = tags.TokenID
        local unstakeQuantity = tonumber(tags.Quantity)
        
        -- Step 1: Validate user existence
        local user_exists = sql_run([[SELECT EXISTS (SELECT 1 FROM Users WHERE UserID = (?)) AS value_exists;]], msg.From)
        if user_exists[1].value_exists == 0 then
            Handlers.utils.reply("User does not exist, please register first.")(msg)
            return
        end
        
        -- Step 2: Check if the user has enough staked tokens
        local stakedTokens = sql_run([[SELECT TotalStaked FROM UserStakes WHERE UserID = ? AND ProjectID = ? AND TokenID = ?]], msg.From, projectID, tokenID)
        print(stakedTokens)
        if #stakedTokens == 0 then
            Handlers.utils.reply("No staked tokens found for this project and token.")(msg)
            return
        end

        local currentStake = tonumber(stakedTokens[1].TotalStaked)
        
        if currentStake < unstakeQuantity then
            Handlers.utils.reply("Insufficient staked tokens to unstake.")(msg)
            return
        end

        local currentProjectTotal = sql_run([[SELECT TaoEthStaked FROM Projects WHERE ProjectID = ?]], projectID)
        if currentProjectTotal[1].TaoEthStaked < unstakeQuantity then
            Handlers.utils.reply("ERRORInsufficient staked tokens to unstake.")(msg) 
            return
        else
            local projectTotal = tonumber(currentProjectTotal[1].TaoEthStaked)
            local newProjectTotal = projectTotal - unstakeQuantity
            sql_write([[UPDATE Projects SET TaoEthStaked = ? WHERE ProjectID = ?]], tostring(newProjectTotal), projectID)
        end
        
        -- Step 3: Update user's stake balance
        local newTotal = currentStake - unstakeQuantity
        if newTotal == 0 then
            sql_write([[DELETE FROM UserStakes WHERE UserID = ? AND ProjectID = ? AND TokenID = ?]], msg.From, projectID, tokenID)
        else
            sql_write([[UPDATE UserStakes SET TotalStaked = ? WHERE UserID = ? AND ProjectID = ? AND TokenID = ?]], tostring(newTotal), msg.From, projectID, tokenID)
        end
        

        -- Step 5: Initiate token transfer back to the user
        ao.send({
            Target = tokenID,
            Action = "Transfer",
            Recipient = msg.From,
            Quantity = tostring(unstakeQuantity),
            ["X-Data"] = "Unstake refund",
            ["X-ProjectID"] = projectID,
            ["X-Action"] = "Unstaked" 
        })
        
        Handlers.utils.reply("Unstake successful, tokens returned.")(msg)
        print("UNSTAKE COMPLETED")
    end
)

-- UNSTAKE BY USER DEBIT NOTICE
Handlers.add(
    "UnstakedDebit",
    Handlers.utils.hasMatchingTag("X-Action", "Unstaked") and Handlers.utils.hasMatchingTag("Action", "Debit-Notice"),
    function(msg)
        print("works")
        local tags = msg.Tags
        local projectID
        for k,v in pairs(msg.Tags) do 
            if k == "X-ProjectID" then
                projectID = v
            end
        end
        local logTrans = sql_write([[
            INSERT INTO Transactions (Timestamp, TransID, UserID, TokenID, Quantity, ProjectID, Status, Type) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        ]], tostring(msg.Timestamp), msg.Id, tags.Recipient, msg.From, tags.Quantity, projectID, "fulfilled", "utf") 
    end
)

-- AO TO PROJECT DEBIT NOTICE
Handlers.add(
    "AOToProjectDebit",
    Handlers.utils.hasMatchingTag("X-Action", "AOToProject") and Handlers.utils.hasMatchingTag("Action", "Debit-Notice"),
    function(msg)
        local logTrans = sql_write([[
            INSERT INTO Transactions (Timestamp, TransID, UserID, TokenID, Quantity, ProjectID, Status, Type) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        ]], tostring(msg.Timestamp), msg.Id, "nil", msg.From, tags.Quantity, tags.Recipient, "fulfilled", "utf")  
    end
)

Handlers.add(
    "InfoUserStakes",
    Handlers.utils.hasMatchingTag("Action", "Info-UserStakes"),
    function(msg)
        local userStakes = sql_run([[SELECT * FROM UserStakes]]);
        print(userStakes)
        Handlers.utils.reply(json.encode(userStakes))(msg)
    end
)

Handlers.add(
    "InfoProjects",
    Handlers.utils.hasMatchingTag("Action", "Info-Projects"),
    function(msg)
        local projects = sql_run([[SELECT * FROM Projects]]);
        print(projects)
        Handlers.utils.reply(json.encode(projects))(msg)
    end
)

Handlers.add(
    "InfoTransactions",
    Handlers.utils.hasMatchingTag("Action", "Info-Transactions"),
    function(msg)
        local transactions = sql_run([[SELECT * FROM Transactions]]);
        print(transactions)
        Handlers.utils.reply(json.encode(transactions))(msg)
    end
)