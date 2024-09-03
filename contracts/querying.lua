-- local projectIds = require("utils.projects")

Handlers.add(
    "CronTick",
    Handlers.utils.hasMatchingTag("Action", "Cron"),
    function(msg)
        ao.send(
            Target = ao.id,
            Action = "Balances",
        )
    end
)

Handlers.add(
    "Balances",
    Handlers.utils.hasMatchingTag("Action", "Balances"),
    function(msg)
        for _, i in ipairs(projects) do
            Send({
                Target = ao.id,
                Action = "Balances"
            })
        end
    end
)


