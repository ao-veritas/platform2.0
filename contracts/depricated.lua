-- Handlers.add(
--     "test",
--     Handlers.utils.hasMatchingTag("Action", "Test"),
--     function(msg)
--         local test = "abc"
--         local write_res = sql_write([[INSERT INTO Users (Name) VALUES (?)]], test)
--         local p = sql_run([[SELECT * FROM Users Where Name = "abc" ]])
--         for _, pkg in ipairs(p) do
--             print(pkg)
--         end
--         print(tostring(p))
--     end
-- )
-- Handlers.add(
--     "Stake",
--     Handlers.utils.hasMatchingTag("Action", "Stake"),
--     function(msg)
--         -- CHECK USER TABLE, if not then add or send notif to register (?)
--         if not Users[msg.From] then Users[msg.Sender] = "0" end 
--         -- FE sends transfer message as below
--             -- ao.send(
--             --     Target = msg.Tags.bridgedID,
--             --     Action = "Transfer",
--             --     Recipient = platformID,
--             --     Quantity = msg.Tags.Quantity,
--             --     ["X-Action"] = "Staked"
--             -- )
--             -- THIS CREATES A MSG ID
--         -- log the info
--             -- TRANSACTIONS.ID = msg.Tags.msgID
--             -- TRANSACTIONS.amount= msg.Tags.Quantity, 
--             -- TRANSACTIONS.userID= msg.From, 
--             -- TRANSACTIONS.tokenID = msg.Tags.bridgedID, 
--             -- TRANSACTIONS.projectID = msg.["X-ProjectID"]
--             -- TRANSACTION.type = btf
--             -- TRANSACTION.status = pending --IMPORTANT ADD
--             -- store to project = X-ProjectID (?)
--     end
-- )
 

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
--         tokenID
--         Quantity
--         projectID
--         status
--         enum type{
--             btf -- bridged to fa
--             atf -- ao to fa
--             ftp -- fa to proj
--             ptf -- proj to fa
--             ftu -- fa to user
--         }
--     }
-- BRIDGEDTOKENS: 
--     AOETH: id
--     AOSOL: id
-- TOTALS:
--     shall this be on the pid or bid (?)
--     projectID.bridgedID.Quantity

-- Handlers.add(
--     "Create-Transaction",
--     Handlers.utils.hasMatchingTag("Action", "Create-Transaction"),
--     function(msg)
-- -- maybe this needs to be just a functiona dn not a handler
--     end
-- )



-- Handlers.add(
--     "test",
--     Handlers.utils.hasMatchingTag("Action", "Test"),
--     function(msg)
--         print(verifiedBridgedToken)
--     end
-- )

TEST PRINTS FOR STAKED TRANSACTION Logo 
        -- print("TEST PRINTS")      
-- print("projectID" .. projectID .. ":" .. type(projectID))
-- print("time" .. msg.Timestamp .. ":" .. type(tostring(msg.Timestamp)))
-- print("transID" .. msg.Id .. ":" ..type(msg.Id))
-- print("UserID" .. tags.Sender .. ":".. type(tags.Sender))
-- print("TokenID" .. msg.From .. ":" ..type(msg.From))
-- print("Quantityt" .. tags.Quantity .. ":" ..type(tags.Quantity))
-- print("TEST PRINTS END")


user1: dE7vTrHgqAUK7h2zOVq_RxoRA8V5roKY9mPTD8blUlA
user2: 6VFFgcNeclukALVW1EUujnuDClc3rdKGarJyEQZzsJA
UserToPlatformStake: Send({Target = "D-SQxfti8Bl_TeJAAhhcsbuKH6H1PzZ-v_t1nalAdlI", Action = "Transfer", ["X-ProjectID"]="asdfg", Quantity = "10000000000", Recipient="l13OiZyp7T5YpmOqofjHRGyCbrpllLZp4HOyfa2WLPQ", ["X-Action"]="Staked"})
sql_run([[SELECT * FROM Projects;]])
sql_run([[SELECT * FROM Transactions;]])
AoToPltform: Send({Target = ao.id, Action="Transfer", Quantity="1000000000", Recipient="l13OiZyp7T5YpmOqofjHRGyCbrpllLZp4HOyfa2WLPQ"})
Send({Target = "D-SQxfti8Bl_TeJAAhhcsbuKH6H1PzZ-v_t1nalAdlI", Action = "Transfer", ["X-ProjectID"]="rXQaiyznUgDrt7A0Nzl9OQN2QBJ3we1X3qMe2W5DBXU", Quantity = "10000000000", Recipient="l13OiZyp7T5YpmOqofjHRGyCbrpllLZp4HOyfa2WLPQ", ["X-Action"]="Staked"})
REGISTER PROJECT = Send({Target = ao.id, Action = "Register-Project", projectID="rXQaiyznUgDrt7A0Nzl9OQN2QBJ3we1X3qMe2W5DBXU", projectTokenID="lrTtKXMhdmMSi8ZfTsdSX24Xpm9FAo47CRHe82HZ7XA"})
USERUNSTAKES: Send({Target = "l13OiZyp7T5YpmOqofjHRGyCbrpllLZp4HOyfa2WLPQ", Action="Unstaked", Quantity="1000000000", ProjectID="rXQaiyznUgDrt7A0Nzl9OQN2QBJ3we1X3qMe2W5DBXU", TokenID = "D-SQxfti8Bl_TeJAAhhcsbuKH6H1PzZ-v_t1nalAdlI" })