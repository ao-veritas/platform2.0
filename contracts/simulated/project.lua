-- rXQaiyznUgDrt7A0Nzl9OQN2QBJ3we1X3qMe2W5DBXU
PROJECTTOKENID = "lrTtKXMhdmMSi8ZfTsdSX24Xpm9FAo47CRHe82HZ7XA"
FUNDARSID = "l13OiZyp7T5YpmOqofjHRGyCbrpllLZp4HOyfa2WLPQ"
Handlers.add(
    "Notification",
    Handlers.utils.hasMatchingTag("Action", "Notif") and Handlers.utils.hasMatchingTag("From-Process", FUNDARSID),
    function(msg)
        local tags = msg.Tags
        local TotalPTokensQuantity = tags.Quantity
        -- print(typeof(TotalPTokensQuantity))
        print("total p tokens" .. TotalPTokensQuantity)
        print("notif enter")
            ao.send({
                Target = PROJECTTOKENID,
                Action = "Transfer",
                Quantity = TotalPTokensQuantity,
                Recipient = FUNDARSID
            })
    end
)