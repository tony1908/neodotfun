import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ArrowDownIcon, RepeatIcon, SettingsIcon } from "@chakra-ui/icons";
import { encodeFunctionData, decodeFunctionResult, createPublicClient, custom } from "viem"; 
import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Text,
  VStack,
  HStack,
  Image,
  Divider,
  IconButton,
  ChakraProvider,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from 'axios';
import { neonAbi } from './abi/neonAbi';
import { web3 } from "@solana/web3.js";
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from "@solana/spl-token";

const GLOBAL = new web3.PublicKey("4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf");
const FEE_RECIPIENT = new web3.PublicKey("CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM");
const TOKEN_PROGRAM_ID = new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const ASSOC_TOKEN_ACC_PROG = new web3.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
const RENT = new web3.PublicKey("SysvarRent111111111111111111111111111111111");
const PUMP_FUN_PROGRAM = new web3.PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P");
const PUMP_FUN_ACCOUNT = new web3.PublicKey("Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1");
const SYSTEM_PROGRAM_ID = web3.SystemProgram.programId;

const bufferFromUInt64 = (value) => {
  let buffer = Buffer.alloc(8);
  buffer.writeBigUInt64LE(BigInt(value));
  return buffer;
};

const Main = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("0.00");
  const [tokenLogo, setTokenLogo] = useState(
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
  );
  const solanaLogo =
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png";
  const [coinData, setCoinData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { primaryWallet } = useDynamicContext();

  const getCoinData = async (mintStr) => {
    try {
      const url = `https://frontend-api.pump.fun/coins/${mintStr}`;
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
          "Accept": "*/*",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          "Referer": "https://www.pump.fun/",
          "Origin": "https://www.pump.fun",
          "Connection": "keep-alive",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "cross-site",
          "If-None-Match": 'W/"43a-tWaCcS4XujSi30IFlxDCJYxkMKg"'
        }
      });
      if (response.status === 200) {
        setCoinData(response.data);
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching coin data:', error);
      return null;
    }
  };

  const handleTokenAddressChange = async (e) => {
    const address = e.target.value;
    setTokenAddress(address);
    if (address) {
      const data = await getCoinData(address);
      if (data && data.image_uri) {
        setTokenLogo(data.image_uri);
        setCoinData(data);
      }
    } else {
      setTokenLogo(solanaLogo);
      setCoinData(null);
    }
  };

  const handleSwap = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const provider = await primaryWallet.connector.getSigner();
      const connection = new web3.Connection("https://api.mainnet-beta.solana.com", "processed");
      
      // Get user's public key
      const userPublicKey = new web3.PublicKey(primaryWallet.address);
      const mint = new web3.PublicKey(tokenAddress);

      // Get associated token account
      const tokenAccountAddress = await getAssociatedTokenAddress(
        mint,
        userPublicKey,
        true
      );

      let txBuilder = new web3.Transaction();

      // Check if token account exists and create if needed
      const tokenAccountInfo = await connection.getAccountInfo(tokenAccountAddress);
      if (!tokenAccountInfo) {
        txBuilder.add(
          createAssociatedTokenAccountInstruction(
            userPublicKey,
            tokenAccountAddress,
            userPublicKey,
            mint
          )
        );
      }

      // Calculate amounts
      const solIn = parseFloat(amount);
      const slippageDecimal = 0.25;
      const solInLamports = solIn * web3.LAMPORTS_PER_SOL;
      const tokenOut = Math.floor(solInLamports * coinData["virtual_token_reserves"] / coinData["virtual_sol_reserves"]);
      const solInWithSlippage = solIn * (1 + slippageDecimal);
      const maxSolCost = Math.floor(solInWithSlippage * web3.LAMPORTS_PER_SOL);

      // Build swap instruction
      const keys = [
        { pubkey: GLOBAL, isSigner: false, isWritable: false },
        { pubkey: FEE_RECIPIENT, isSigner: false, isWritable: true },
        { pubkey: mint, isSigner: false, isWritable: false },
        { pubkey: new web3.PublicKey(coinData['bonding_curve']), isSigner: false, isWritable: true },
        { pubkey: new web3.PublicKey(coinData['associated_bonding_curve']), isSigner: false, isWritable: true },
        { pubkey: tokenAccountAddress, isSigner: false, isWritable: true },
        { pubkey: userPublicKey, isSigner: true, isWritable: true },
        { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: RENT, isSigner: false, isWritable: false },
        { pubkey: PUMP_FUN_ACCOUNT, isSigner: false, isWritable: false },
        { pubkey: PUMP_FUN_PROGRAM, isSigner: false, isWritable: false },
      ];

      const data = Buffer.concat([
        bufferFromUInt64("16927863322537952870"),
        bufferFromUInt64(tokenOut),
        bufferFromUInt64(maxSolCost)
      ]);

      const swapInstruction = new web3.TransactionInstruction({
        keys: keys,
        programId: PUMP_FUN_PROGRAM,
        data: data
      });

      txBuilder.add(swapInstruction);

      // Sign and send transaction
      const signature = await provider.sendTransaction(txBuilder);
      await connection.confirmTransaction(signature);

      setIsLoading(false);
      alert('Swap completed successfully!');
      
    } catch (error) {
      console.error('Swap failed:', error);
      setError('Swap failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <ChakraProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center text-white">
        <div className="flex flex-col items-center justify-center text-center">
          <DynamicWidget />
        </div>
        <div className="flex mt-16 space-x-4">
          <Container maxW="container.md" py={8}>
            <Box w="100%" bg="white" borderRadius="xl" boxShadow="xl" p={8}>
              <Flex justifyContent="space-between" alignItems="center" mb={4}>
                <Text fontSize="xl" fontWeight="bold" color="black">
                  Swap
                </Text>
                <HStack spacing={2}>
                  <IconButton
                    aria-label="Settings"
                    icon={<SettingsIcon />}
                    variant="ghost"
                    size="sm"
                  />
                  <IconButton
                    aria-label="Refresh"
                    icon={<RepeatIcon />}
                    variant="ghost"
                    size="sm"
                  />
                </HStack>
              </Flex>

              <VStack spacing={6} align="stretch">
                <Box bg="gray.50" p={6} borderRadius="xl">
                  <Text mb={3} color="gray.500" fontSize="md">
                    You Pay
                  </Text>
                  <Flex alignItems="center" justifyContent="space-between">
                    <Input
                      variant="unstyled"
                      placeholder="0.00"
                      fontSize="3xl"
                      fontWeight="bold"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      w="70%"
                      color="black"
                    />
                    <HStack spacing={3}>
                      <Image src={solanaLogo} boxSize="32px" />
                      <Text fontWeight="bold" color="black" fontSize="xl">SOL</Text>
                    </HStack>
                  </Flex>
                  <Text mt={2} color="gray.500" fontSize="sm">
                    Balance: 0.00 SOL
                  </Text>
                </Box>

                <Flex justify="center" position="relative" py={2}>
                  <IconButton
                    aria-label="Switch tokens"
                    icon={<ArrowDownIcon />}
                    bg="white"
                    border="4px solid"
                    borderColor="gray.100"
                    borderRadius="full"
                    size="sm"
                  />
                </Flex>

                <Box bg="gray.50" p={6} borderRadius="xl">
                  <Text mb={3} color="gray.500" fontSize="md">
                    You Receive
                  </Text>
                  <Flex alignItems="center" justifyContent="space-between">

                    <HStack spacing={3} bg="white" p={3} borderRadius="lg" flex="1">
                      <Image
                        src={tokenLogo}
                        boxSize="32px"
                        fallbackSrc={solanaLogo}
                      />
                      <Input
                        placeholder="Enter token address"
                        value={tokenAddress}
                        onChange={handleTokenAddressChange}
                        size="md"
                        flex="1"
                        bg="transparent"
                        border="none"
                        color="black"
                        fontSize="lg"
                        _focus={{
                          border: "none",
                          boxShadow: "none",
                        }}
                        _hover={{
                          border: "none",
                        }}
                      />
                      {coinData && (
                        <Text color="black" fontSize="lg" fontWeight="bold">
                          {coinData.symbol}
                        </Text>
                      )}
                    </HStack>
                  </Flex>
                  <Text mt={2} color="gray.500" fontSize="sm">
                  </Text>
                </Box>

                <Box>
                  <Flex justify="space-between" mb={2}>
                    <Text color="gray.500">Rate</Text>
                    <Text color="black">1 SOL = ? Tokens</Text>
                  </Flex>
                  <Flex justify="space-between" mb={2}>
                    <Text color="gray.500">Network Fee</Text>
                    <Text color="black">0.00005 SOL</Text>
                  </Flex>
                </Box>

                <Button
                  w="100%"
                  size="lg"
                  bg="blue.500"
                  color="white"
                  _hover={{ bg: "blue.600" }}
                  _active={{ bg: "blue.700" }}
                  fontSize="lg"
                  fontWeight="bold"
                  h="60px"
                  borderRadius="xl"
                  onClick={handleSwap}
                  isLoading={isLoading}
                  disabled={!amount || !tokenAddress || isLoading}
                >
                  {error ? error : 'Swap'}
                </Button>
              </VStack>
            </Box>
          </Container>
        </div>
      </div>
    </ChakraProvider>
  );
}

export default Main;
