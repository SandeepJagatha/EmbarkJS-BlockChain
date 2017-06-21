pragma solidity ^0.4.7;

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract MetaCoin {
	mapping (address => uint) balances;
    uint initial_balance = 10000;
    
	function MetaCoin() {
		balances[tx.origin] = initial_balance;
	}

	function sendCoin(address receiver, uint amt) returns(bool sufficient) {
		if (balances[msg.sender] < amt) return false;
		balances[msg.sender] -= amt;
		balances[receiver] += amt;
		return true;
	}

	function getBalance(address who) constant returns (uint  value) {
  	    return balances[who];
	}
    
    function setMainAccount(address admin, uint amount) returns (bool success){
      balances[admin] = amount;
      return true;
    }
    
    function sendCoin2(address sender, address receiver, uint amt) returns(bool sufficient) {
		if (balances[sender] < amt) return false;
		balances[sender] -= amt;
		balances[receiver] += amt;
		return true;
	}
    
    function sendCoinByType(address mainAccount, address receiver, string transferType) returns(bool sufficient) {
       uint transferTypeAmount;
       
        if (sha3(transferType) == sha3("timesheet")) {
            transferTypeAmount = 100;
        } else if(sha3(transferType) == sha3("xyz")){
            transferTypeAmount = 10;
        } else if(sha3(transferType) == sha3("abc")){
            transferTypeAmount = 20;
        }else{
            transferTypeAmount = 1;
        }
        
        if (balances[msg.sender] < transferTypeAmount) return false;
        
		balances[mainAccount] -= transferTypeAmount;
		balances[receiver] += transferTypeAmount;
        
        return true;
	}
    

}
