"use client";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Button, Box, Flex } from "@chakra-ui/react";
import { MetaMaskInpageProvider } from "@metamask/providers";
import useCustomToast from '../components/hooks/useCustomToast';

type ConnectProps = {
  address: string | null | undefined;
  onConnect: (address: string) => void;
  onDisconnect: () => void;
};

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

const Connect = ({ address, onConnect, onDisconnect }: ConnectProps) => {
    console.log("address",address)
    console.log("onConnect",onConnect)

  const router = useRouter();
  const { showWarningToast } = useCustomToast();

  const isMumbaiChain = async () => {
    const { ethereum } = window;
    if (!ethereum) return false;

    try {
      const chainId = await ethereum.request({
        method: "eth_chainId",
      });
      return chainId === "0x13881";
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const switchToMumbaiChain = async () => {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: "0x13881",
        },
      ],
    });
  };

  const connectWallet = async () => {
    const isGoerli = await isMumbaiChain();
    if (!isGoerli) {
      await switchToMumbaiChain();
    }

    const { ethereum } = window;
    if (!ethereum) return;

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (Array.isArray(accounts)) {
        onConnect(accounts[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const disconnectWallet = () => {
    onDisconnect();
    router.push("/");
  };

  useEffect(() => {
    const handleChainChanged = async () => {
      const isGoerli = await isMumbaiChain();
      if (!isGoerli) {
        showWarningToast(
          "請切換至 Mumbai 測試網路",
          "將自動為您切換至 Mumbai, 請至小狐狸錢包進行切換"
        );
        await switchToMumbaiChain();
      }
    };

    const { ethereum } = window;
    if (ethereum) {
      ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (ethereum) {
        ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  // Listen for metamask wallet change account events
  useEffect(() => {
    const handleAccountsChanged =  (...accounts: unknown[])  => {
      const castedAccounts = accounts as string[];
      if (castedAccounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        console.log('Please connect to MetaMask.');
      } else if (castedAccounts[0] !== address) {
        onConnect(castedAccounts[0]);
      }
    };
    // add accountsChanged event listener
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    // Cleanup function
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [address, onConnect]);

  return (
    <Flex
      fontWeight="bold"
      position="absolute"
      top="8px"
      right="8px"
      zIndex="10"
    >
      {address && (
        <Box
          bg="white"
          minW="120px"
          p="8px 16px"
          borderRadius="16px"
          textAlign="center"
          marginRight="16px"
        >
          <Button onClick={disconnectWallet} size="sm" variant="link" color="purple" >
            取消連結
          </Button>
        </Box>
      )}
      <Box
        bg="white"
        minW="120px"
        p="8px 16px"
        borderRadius="16px"
        textAlign="center"
      >
        {!address && (
          <Button onClick={connectWallet} size="sm" variant="link" color="purple">
            連結錢包
          </Button>
        )}
        {address && (
          <span>
            💳 {address.toString().slice(0, 6)}
            ...{address.toString().slice(-4)}
          </span>
        )}
      </Box>
    </Flex>
  );
};

export default Connect;
