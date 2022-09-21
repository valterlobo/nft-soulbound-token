const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("NFTSBT", function () {
  async function deployContract() {
    const [owner, otherAccount] = await ethers.getSigners();

    const NFTSoulboundToken = await ethers.getContractFactory(
      "NFTSoulboundToken"
    );
    const nftSoulboundToken = await NFTSoulboundToken.deploy();

    await nftSoulboundToken.setListMerkleRoot("0x584c0a067b3f070897de85c09cb07935ae60c88a9c5117e3ca4a05b1df7200b6"); 

    return { nftSoulboundToken, owner, otherAccount };
  }

  describe("Deployment", function () {

    it("Deploy do contrato", async function () {
      const { nftSoulboundToken } = await loadFixture(deployContract);
    });

    it("Verificar transferencia", async function () {
      const { nftSoulboundToken, owner, otherAccount } = await loadFixture(deployContract);

      expect(await nftSoulboundToken.owner()).to.equal(owner.address);

      console.log(otherAccount.address)

      let tkID = await nftSoulboundToken.createToken("1234444", "JOAO SILVA NOGUEIRA",
      otherAccount.address , "http://id.com/XXXXX.jpg", 
       [ '0x8a3552d60a98e0ade765adddad0a2e420ca9b1eef5f326ba7ab860bb4ea72c94',
       '0xbe29cab431c16053f952547c693515d3882e1a4934842795045ece755223b2fe']);

      expect(await nftSoulboundToken.ownerOf(1)).to.equal(otherAccount.address);

      //await nftSoulboundToken.connect(otherAccount).transferFrom( otherAccount.address,owner.address, 1);

     // await nftSoulboundToken.createToken("1234444", "JOAO SILVA NOGUEIRA", otherAccount.address, "http://id.com/XXXXX.jpg");

      //expect(await nftSoulboundToken.ownerOf(1)).to.equal(owner.address);

    });

    it("Testar prova", async function () {
      const { nftSoulboundToken, owner } = await loadFixture(deployContract);
    });
  });
});
