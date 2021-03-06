pragma solidity ^0.4.0;

import "./erc721.sol";

contract GreenCert is ERC721 {
    struct record {
        address generator;
        uint begin;
        uint end;
    }
    
    record[] public records;
    address public founder;
    
    mapping (address=>bool) generators;
    mapping (address=>string) generatorsName;
    mapping (address=>bool) verificators;
    mapping (address=>string) verificatorsName;
    
    event RecordAdded(address indexed generator, uint indexed number);
    event Green(uint indexed number, address indexed owner);
    
    constructor() public {
        founder = msg.sender;
    }
    
    modifier onlyFounder() {
        require(msg.sender == founder);
        _;
    }

    
    function addGenerator(address addr, string name) public onlyFounder {
        generators[addr] = true;
        generatorsName[addr] = name;
    }

    function addVerificator(address addr, string name) public onlyFounder {
        verificators[addr] = true;
        verificatorsName[addr] = name;
    }

    modifier onlyGenerators() {
        require(generators[msg.sender]);
        _;
    }

    function addRecord(uint begin, uint end) public onlyGenerators {
        uint idx = records.length;
        records.push(record(msg.sender, begin, end));
        emit RecordAdded(msg.sender, idx);
    }
    
    modifier onlyVerificators() {
        require(verificators[msg.sender]);
        _;
    }

    function approveToGreen(uint idx) public onlyVerificators {
        require(tokenOwners[idx]==0x0);
        _addToken(idx, records[idx].generator);
        tokenOwners[idx] = records[idx].generator;
        totalSupply++;
        emit Green(idx, records[idx].generator);
        emit Transfer(0x0, records[idx].generator, idx);
    }
    
    function isGreen(uint idx) public view returns(bool, address) {
        if (ownerOf(idx) == 0x0) {
            return (false, 0x0);
        }
        return (true, ownerOf(idx));
    }
    
}
