"use client";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Button, Box, Flex, useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";

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

  const toast = useToast();
  const router = useRouter();

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
        toast({
          title: "請切換至 Mumbai 測試網路",
          description: "將自動為您切換至 Mumbai, 請至小狐狸錢包進行切換",
          status: "warning",
          variant: "subtle",
        });
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
  }, [toast]);

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
            💳 {address.slice(0, 6)}
            ...{address.slice(-4)}
          </span>
        )}
      </Box>
    </Flex>
  );
};

export default Connect;
