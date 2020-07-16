const TestTx = artifacts.require("TestTx");
import {TestTxInstance} from "../types/truffle-contracts";
import {Tx, serialize} from "./tx";

contract("Tx Serialization", accounts => {
  let c: TestTxInstance;
  before(async function() {
    c = await TestTx.new();
  });

  it("parse transaction", async function() {
    const txSize = 32;
    const txs: Tx[] = [];
    for (let i = 0; i < txSize; i++) {
      txs.push(Tx.rand());
    }
    const serialized = serialize(txs);
    assert.equal(txSize, (await c.size(serialized)).toNumber());
    assert.isFalse(await c.hasExcessData(serialized));
    for (let i = 0; i < txSize; i++) {
      let amount = (await c.amountOf(serialized, i)).toNumber();
      assert.equal(amount, txs[i].amount);
      let sender = (await c.senderOf(serialized, i)).toNumber();
      assert.equal(sender, txs[i].sender);
      let receiver = (await c.receiverOf(serialized, i)).toNumber();
      assert.equal(receiver, txs[i].receiver);
      let h0 = txs[i].hash();
      let h1 = await c.hashOf(serialized, i);
      assert.equal(h0, h1);
    }
  });
});
