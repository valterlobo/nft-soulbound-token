// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

// NFT Soulbound Tokens

contract NFTSoulboundToken is
    ERC721,
    ERC721URIStorage,
    ERC721Burnable,
    Ownable
{
    string constant HAS_TOKEN = "address already has a token";

    struct Info {
        string doc;
        string name;
        string img;
        uint256 time;
        uint256 tokenId;
    }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(address => Info) internal addressPools;

    bytes32 private listMerkleRoot;

    // ==================== EVENTS ====================

    event SetListMerkleRoot(bytes32 indexed root);

    constructor() ERC721("NFT Soulbound Token", "NFTSBT") {}

    modifier isValidSoulbounbAddress(
        bytes32[] calldata merkleProof,
        address addr
    ) {
        require(
            MerkleProof.verify(
                merkleProof,
                listMerkleRoot,
                keccak256(abi.encodePacked(addr))
            ),
            "Address not in list"
        );
        _;
    }

    function setListMerkleRoot(bytes32 merkleRoot) external onlyOwner {
        listMerkleRoot = merkleRoot;
        emit SetListMerkleRoot(merkleRoot);
    }

    function createToken(
        string memory _doc,
        string memory _name,
        address _address,
        string memory _img,
        bytes32[] calldata merkleProof
    ) public onlyOwner    isValidSoulbounbAddress(merkleProof,_address) returns (uint256) {
        Info memory info = addressPools[_address];
        require(info.tokenId == 0, HAS_TOKEN);
        require(balanceOf(_address) == 0, HAS_TOKEN);

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(_address, newItemId);
        //_setTokenURI(newItemId, tokenURI);
        info = Info(_doc, _name, _img, block.timestamp, newItemId);
        addressPools[_address] = info;

        return newItemId;
    }

    //TRANSFER FUNCTION
    function _transferBlock(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual {
        revert("NOT transfer");
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        _transferBlock(from, to, tokenId);
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        _transferBlock(from, to, tokenId);
    }

    ////////////////////////////////
    // functions overrides required by Solidity.
    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
        onlyOwner
    {
        address _address = ownerOf(tokenId);
        delete addressPools[_address];
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        //montar a token uri aqui - image etc.
        return super.tokenURI(tokenId);
    }
}
