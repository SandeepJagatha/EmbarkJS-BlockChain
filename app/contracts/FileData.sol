pragma solidity ^0.4.8;

contract FileData {
     struct EntityStruct {
        uint date;
        string json;
    }

    EntityStruct[] public entityStructs;

    function newEntity(uint date, string json) public returns(uint rowNumber) {
        EntityStruct memory newEntity;
        newEntity.date    = date;
        newEntity.json    = json;
        return entityStructs.push(newEntity)-1;
    }

    function getEntityCount() public constant returns(uint entityCount) {
        return entityStructs.length;
    }
    
    function getEntities(uint index) public constant returns(uint, string) {
        return (entityStructs[index].date, entityStructs[index].json);
    }
    
}