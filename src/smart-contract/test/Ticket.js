const Ticket = artifacts.require('./Ticket.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Ticket', (accounts) => {
  let contract

  before(async () => {
    contract = await Ticket.deployed()
  })

  describe('ticket deployment', async () => {
    it('deploys successfully', async () => {
      const address = contract.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await contract.name()
      assert.equal(name, 'Ticket')
    })

    it('has a symbol', async () => {
      const symbol = await contract.symbol()
      assert.equal(symbol, 'TCK')
    })

  })

  describe('event and ticket deployment', async () => {
    it('create a new event and create ticket', async () => {
      let detailObj = {
        name: '張敬軒盛樂演唱會',
        venu: '紅磡體育館',
        contact: '+852-56281088',
        email: 'timchengy@gmail.com',
        startDate: 1607701444,
        endDate: 1607701444,
        need_kyc: true,
        country: 'HK',
        district: 'Hung Hom',
        fullAddress: 'Hong Kong Coliseum',
        company: 'XXX Company',
        description: 'XXXX Description',
        totalSupply: 5000,
        performer: '張敬軒',
        category: 'sing',
        startDateSell: 1607701444,
        endDateSell: 1607701444
      };
      await contract.createEvent(accounts[0], JSON.stringify(detailObj));
      await contract.addApproval(accounts[0]);
      await contract.addApproval(accounts[1]);

      let ownerBalance = await contract.eventOwnerBalanceOf(accounts[0]);
      let eventOwner = await contract.getEventOwner(0);
      let isApprovel = await contract.isApprovel(accounts[1]);
      let event_id = await contract.getEventId();
      assert.equal(event_id, 1)
      assert.equal(isApprovel, true)
      assert.equal(eventOwner, accounts[0])
      assert.equal(ownerBalance, 1)

      let obj = {
        area: 'area1',
        row: 1,
        column: 1,
        seat: `ROW ${row} - COL ${column}`,
        available: true
      }
      await contract.mint(obj);
    });
  })

  describe('indexing', async () => {
    it('lists tickets', async () => {
      await contract.safeTransferFrom(accounts[0], accounts[1], 0);
      // for (let i = 0; i <= 4; i++) {
      //   let ticket = await contract.tickets(i)
      //   assert.equal(ticket.eventId, 0)
      //   // console.log(`ticket ${i} >>> `, ticket)
      // }

    })
  })
})
