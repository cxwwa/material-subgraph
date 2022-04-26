import {
  Transfer,
} from "../generated/objectOwnership/objectOwnership"
import { EventTest } from "../generated/schema"

export function handleTransfer(event: Transfer): void {
  const test = new EventTest(event.params._from.toHex())
  test.to = event.params._to
  test.from = event.params._from
  test.tokenId = event.params._tokenId.toHexString()
  test.save()
}
