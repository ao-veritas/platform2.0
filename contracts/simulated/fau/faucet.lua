
-- import this file in the token contract you want to use the faucet in
-- local faucetData = require('faucet')


local AirdropedAtBlock = AirdropedAtBlock or {}

AIRDROPPED_QUANTITY = "10000000000000"

Handlers.add('airdrop-tokens', Handlers.utils.hasMatchingTag('Action', 'tAoETH-Airdrop'), function(msg)
    local currentHeight = tonumber(msg['Block-Height'])
    local address = msg.From

    if AirdropedAtBlock[address] then
        assert(currentHeight - AirdropedAtBlock[address] > 1, "Please wait for some time before requesting airdrop again!")
    end

    AirdropedAtBlock[address] = currentHeight

    print("sending " .. AIRDROPPED_QUANTITY .. " tokens ")

    ao.send({
      Target = msg.Target,
      Recipient = msg.From,
      Action = 'Transfer',
      Quantity = AIRDROPPED_QUANTITY,
    })

  end)


return AirdropedAtBlock