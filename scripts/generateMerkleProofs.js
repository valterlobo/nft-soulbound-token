const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const fs = require('fs');

const generateMerkleProof = (addressesPath, address) => {
    const addresses = require(addressesPath);
    const leafNodes = addresses.map((addr) => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  
    const hashedAddress = keccak256(address);
    const proof = merkleTree.getHexProof(hashedAddress);
    const root = merkleTree.getHexRoot();

    console.log("ROOT") ; 
    console.log(root);
  
    const valid = merkleTree.verify(proof, hashedAddress, root);
  
    fs.writeFile(`${address}-claimlist-merkle-proof.json`, JSON.stringify({
      valid: valid,
      proof: proof
    }), { flag: 'w+' }, err => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    });
  
    console.log('generateMerkleProof', proof, valid)
    return valid;
  }

  generateMerkleProof('/home/valter/ESTUDOS/solidity/nft-soulbound-token/scripts/mintlist.json', '0x90F79bf6EB2c4f870365E785982E1f101E93b906');
  generateMerkleProof('/home/valter/ESTUDOS/solidity/nft-soulbound-token/scripts/mintlist.json', '0xF4604411A380F13e2AFEa3a6983307411e7d9A1b');
  generateMerkleProof('/home/valter/ESTUDOS/solidity/nft-soulbound-token/scripts/mintlist.json', '0x2fad86e9a409fc4f2aae46e4cc7c38e58e0ed395');
  generateMerkleProof('/home/valter/ESTUDOS/solidity/nft-soulbound-token/scripts/mintlist.json', '0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
