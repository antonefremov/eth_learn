// Step 1: import the contract ABI
const MyContract = require('Embark/contracts/MyContract');

let accounts;

// Step 2: deploy the contract with the paramater "Hello World"
config({
  contracts: {
    "MyContract": {
      args: ["Hello World"]
    }
  }
}, (_err, web3_accounts) => {
  accounts = web3_accounts
});

contract("MyContract", function () {
  it('Puts the correct value in the `myMessage` variable', async () => {
    // Step 3: request the value of myMessage
    let result = await MyContract.methods.myMessage().call();
    // Step 4: verify the value matches our parameter
    assert.strictEqual(result, "Hello World");
  })

  it('sets the right owner at start', async () => {
    let contractOwner = await MyContract.methods.owner().call();
    assert.equal(contractOwner, accounts[0], "Owner does not match.");
  })

  it('Lets the owner set a new message', async () => {
    let newMessage = "Hello RMIT";
    await MyContract.methods.setMessage(newMessage).send();
    let changedMessage = await MyContract.methods.myMessage().call();
    assert.equal(changedMessage, newMessage, "New message not set.")
  })

  it('Lets no one else set a new message', async () => {
    let oldMessage = await MyContract.methods.myMessage().call();
    let newMessage = "Hello, stranger.";
    // await MyContract.methods.setMessage(newMessage).send(); //{ from: accounts[1] }
  //   let tx = MyContract.methods.setMessage(newMessage).send({ from: accounts[1] })
  //   tx.on('transactionHash', function(hash){
  //     console.log({ hash })
  //   })
  //   tx.on('receipt', function(receipt){
  //     console.log({ receipt })
  //   })
  //   await tx
  //   let changedMessage = await MyContract.methods.myMessage().call();
  //   assert.equal(changedMessage, oldMessage, "Non-owner set a new message.");
  // })
    try {
      await MyContract.methods.setMessage(newMessage).send({ from: accounts[1] })
      assert.fail("setMessage call should have thrown an error.")
    } catch(err) {
      assert(err, "Expected an error but did not get one");
      assert(err.message.endsWith("Only owner can call this function."), 
        "Expected failure due to `onlyOwner`, but got: '" + err.message + "' instead.");
    }
  })
})



// /*global contract, config, it, assert*/
/*
const SimpleStorage = require('Embark/contracts/SimpleStorage');

let accounts;

// For documentation please see https://embark.status.im/docs/contracts_testing.html
config({
  //deployment: {
  //  accounts: [
  //    // you can configure custom accounts with a custom balance
  //    // see https://embark.status.im/docs/contracts_testing.html#Configuring-accounts
  //  ]
  //},
  contracts: {
    "SimpleStorage": {
      args: [100]
    }
  }
}, (_err, web3_accounts) => {
  accounts = web3_accounts
});

contract("SimpleStorage", function () {
  this.timeout(0);

  it("should set constructor value", async function () {
    let result = await SimpleStorage.methods.storedData().call();
    assert.strictEqual(parseInt(result, 10), 100);
  });

  it("set storage value", async function () {
    await SimpleStorage.methods.set(150).send();
    let result = await SimpleStorage.methods.get().call();
    assert.strictEqual(parseInt(result, 10), 150);
  });

  it("should have account with balance", async function() {
    let balance = await web3.eth.getBalance(accounts[0]);
    assert.ok(parseInt(balance, 10) > 0);
  });
}
*/
