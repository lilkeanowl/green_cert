pragma solidity ^0.4.0;

contract ERC721 {
    string public constant name = "Green Certificates";
    string public constant symbol = "GRN";
    uint256 public totalSupply = 0;

    mapping (uint256 => address) tokenOwners;
    mapping (address => uint256[]) ownedTokens;
    mapping (uint256 => uint256) ownedTokenIdx;
    mapping (uint256 => address) public approved;
    mapping (uint256 => string) metadata;

    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

    modifier onlyOwner(uint256 _tokenId) {
        require(msg.sender == tokenOwners[_tokenId]);
        _;
    }

    function _addToken(uint256 _tokenId, address _to) internal {
        require(ownedTokenIdx[_tokenId] == 0);
        ownedTokens[_to].push(_tokenId);
        ownedTokenIdx[_tokenId] = ownedTokens[_to].length;
    }

    function _removeToken(uint256 _tokenId, address _from) private {
        uint last = ownedTokens[_from].length - 1;
        uint idx = ownedTokenIdx[_tokenId];
        require(idx != 0);
        if (idx <= last) {
            ownedTokens[_from][idx - 1] = ownedTokens[_from][last];
            ownedTokenIdx[last] = idx;
        }
        ownedTokenIdx[_tokenId] = 0;
        ownedTokens[_from].length = last;
    }

    function _transfer(address _from, address _to, uint256 _tokenId) internal {
        tokenOwners[_tokenId] = _to;
        _removeToken(_tokenId, _from);
        _addToken(_tokenId, _to);
        approved[_tokenId] = address(0x0);
        emit Transfer(_from, _to, _tokenId);
    }

// ERC 721 methods
    function balanceOf(address _owner) public view returns(uint256) {
        return ownedTokens[_owner].length;
    }
    
    function ownerOf(uint256 _tokenId) public view returns(address) {
        return tokenOwners[_tokenId];
    }

    function tokenOfOwnerByIndex(address _owner, uint _idx) public view returns(uint) {
        require(_idx < ownedTokens[_owner].length);
        return ownedTokens[_owner][_idx];
    }

    function transfer(address _to, uint256 _tokenId) public onlyOwner(_tokenId) {
        _transfer(msg.sender, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public onlyOwner(_tokenId) {
        approved[_tokenId] = _to;
        emit Approval(msg.sender, _to, _tokenId);
    }

    function takeOwnership(uint256 _tokenId) public {
        require(approved[_tokenId] == msg.sender);
        _transfer(tokenOwners[_tokenId], msg.sender, _tokenId);
    }

    function tokenMetadata(uint256 _tokenId) public view returns(string memory) {
        return metadata[_tokenId];
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable {}
    function transferFrom(address _from, address _to, uint256 _tokenId) external payable {}
    function setApprovalForAll(address _operator, bool _approved) external {}
    function getApproved(uint256 _tokenId) external view returns (address) {
        return 0x0;
    }
    function isApprovedForAll(address _owner, address _operator) external view returns (bool) {
        return false;
    }
    function supportsInterface(bytes4 interfaceID) external view returns (bool) {
        return true;
    }
    function uint2str(uint i) internal returns (string){
        if (i == 0) return "0";
        uint j = i;
        uint length;
        while (j != 0){
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint k = length - 1;
        while (i != 0){
            bstr[k--] = byte(48 + i % 10);
            i /= 10;
        }
        return string(bstr);
    }
    function strConcat(string _a, string _b) internal returns (string){
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        string memory abcde = new string(_ba.length + _bb.length);
        bytes memory babcde = bytes(abcde);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
        return string(babcde);
    }
    function tokenURI(uint256 _tokenId) external view returns (string) {
        return strConcat("http://159.69.251.155/verify/", uint2str(_tokenId));
    }
}