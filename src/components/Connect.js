import { Button, Box, Flex, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Connect({ address, onConnect, onDisconnect }) {
  const navigate = useNavigate();
  const toast = useToast();

  const isGoerliChain = async () => {
    const { ethereum } = window;
    if (!ethereum) return false;

    try {
      const chainId = await ethereum.request({
        method: "eth_chainId",
      });
      return chainId === "0x5";
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const switchToGoerliChain = async () => {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: "0x5",
        },
      ],
    });
  };

  const connectWallet = async () => {
    const isGoerli = await isGoerliChain();
    if (!isGoerli) {
      await switchToGoerliChain();
    }

    const { ethereum } = window;
    if (!ethereum) return;

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      onConnect(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const disconnectWallet = () => {
    onDisconnect();
    navigate("/");
  };

  useEffect(() => {
    const handleChainChanged = async () => {
      const isGoerli = await isGoerliChain();
      if (!isGoerli) {
        toast({
          title: "請切換至 Goerli 測試網路",
          description: "將自動為您切換至 Goerli, 請至小狐狸錢包進行切換",
          status: "warning",
          variant: "subtle"
        });
        await switchToGoerliChain();
      }
    };

    const { ethereum } = window;
    if (ethereum) {
      ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (ethereum) {
        ethereum.off("chainChanged", handleChainChanged);
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
          <Button
            onClick={disconnectWallet}
            size="sm"
            variant="link"
            color="purple"
          >
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
          <Button
            onClick={connectWallet}
            size="sm"
            variant="link"
            color="purple"
          >
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
}

export default Connect;
