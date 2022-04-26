import {
  Transfer,
} from "../generated/objectOwnership/objectOwnership"
import { Account, TokenAmount } from "../generated/schema"

export function handleTransfer(event: Transfer): void {
  const toId = event.params._to.toHex()
  const fromId = event.params._from.toHex()
  const tokenId = event.params._tokenId.toHex()
  const type = I32.parseInt(tokenId.substr(17, 1))

  let toAccount = Account.load(toId)
  if (!toAccount) {
    toAccount = new Account(toId)
    toAccount.tokensAmount = []
  }
  const toTokenAmountId = `${toId}@${type}`
  let toTokenAmount = TokenAmount.load(toTokenAmountId)
  if (!toTokenAmount) {
    toTokenAmount = new TokenAmount(toTokenAmountId)
    toTokenAmount.amount = 0
    toTokenAmount.type = type

    const toTokensAmount = toAccount.tokensAmount
    toTokensAmount.push(toTokenAmountId)
    toAccount.tokensAmount = toTokensAmount
  }
  toTokenAmount.amount += 1

  const toTokenIdList = toTokenAmount.tokenIdList
  toTokenIdList.push(tokenId)
  toTokenAmount.tokenIdList = toTokenIdList

  toTokenAmount.save()
  toAccount.save()

  const fromAccount = Account.load(fromId)
  if (fromAccount) {
    const fromTokenAmountId = `${fromId}@${type}`
    const fromTokenAmount = TokenAmount.load(fromTokenAmountId)
    if (fromTokenAmount) {
      fromTokenAmount.amount -= 1
      const tokenIdList = fromTokenAmount.tokenIdList
      tokenIdList.splice(tokenIdList.indexOf(tokenId), 1)
      fromTokenAmount.tokenIdList = tokenIdList
      fromTokenAmount.save()
    }
  }
}
