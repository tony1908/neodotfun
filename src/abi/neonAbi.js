export const neonAbi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "salt",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "space",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "lamports",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "programId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "response",
        "type": "bytes32"
      }
    ],
    "name": "CreateResource",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "response",
        "type": "bytes"
      }
    ],
    "name": "LogData",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "CALL_SOLANA",
    "outputs": [
      {
        "internalType": "contract ICallSolana",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64[]",
        "name": "lamports",
        "type": "uint64[]"
      },
      {
        "internalType": "bytes32[]",
        "name": "salt",
        "type": "bytes32[]"
      },
      {
        "internalType": "bytes[]",
        "name": "instruction",
        "type": "bytes[]"
      }
    ],
    "name": "batchExecute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "salt",
        "type": "bytes32"
      },
      {
        "internalType": "uint64",
        "name": "space",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "lamports",
        "type": "uint64"
      },
      {
        "internalType": "bytes32",
        "name": "program_id",
        "type": "bytes32"
      }
    ],
    "name": "createResource",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "lamports",
        "type": "uint64"
      },
      {
        "internalType": "bytes32",
        "name": "salt",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "instruction",
        "type": "bytes"
      }
    ],
    "name": "execute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "salt",
        "type": "bytes32"
      }
    ],
    "name": "getExtAuthority",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "getNeonAddress",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPayer",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "salt",
        "type": "bytes32"
      }
    ],
    "name": "getResourceAddress",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "program_id",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "seeds",
        "type": "bytes"
      }
    ],
    "name": "getSolanaPDA",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

