PROJECTTOKENID = "abc"
FUNDARSID = "123"
Handlers.add(
    "Notification",
    Handlers.utils.hasMatchingTag("Action", "Notif"),
    function(msg)
        local tags = msg.Tags
        -- ITERATE through bridged tokens
            ao.send(
                Target = PROJECTTOKENID,
                Action = "Transfer",
                Quantity = tags.TotalPTokensQuantity,
                Recipient = FUNDARSID
            )
        
    end
)