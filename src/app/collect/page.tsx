"use client";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Divider,
} from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";
import { HomeContext } from "../home";
import useCustomToast from "../../../components/hooks/useCustomToast";
// @ts-ignore
import QrReader from "react-qr-scanner";

function Collect() {
  const context = useContext(HomeContext);
  if (context === undefined) {
    throw new Error("useContext undefined");
  }
  const { connectedContract } = context;
  const {
    showSuccessToast,
    showInfoToastWithReactNode,
    showSuccessToastWithReactNode,
    showErrorToast,
  } = useCustomToast();
  const [showScanner, setShowScanner] = useState(false);
  const [scannedAddress, setScannedAddress] = useState<string | null>(null);
  const [hasTicket, setHasTicket] = useState(false);
  const [checkInTxnPending1, setCheckInTxnPending1] = useState(false);
  const [checkInTxnPending2, setCheckInTxnPending2] = useState(false);

  /**
   * Trigger smart contract checkInStage1 function.
   * This function is used to check in the user and mark them as attended the stage1.
   */
  const checkIn1 = async () => {
    try {
      if (!connectedContract) return;

      setCheckInTxnPending1(true);
      const checkInTxn = await connectedContract.checkInStage1(scannedAddress);

      // Show pending confirmation toast after 5 seconds
      const pendingToastId = setTimeout(() => {
        showInfoToastWithReactNode(
          "已送出交易",
          <a
            href={`https://mumbai.polygonscan.com/tx/${checkInTxn.hash}`}
            target="_blank"
            rel="nofollow noreferrer"
          >
            交易已送出，在區塊鏈瀏覽器確認進度！
          </a>
        );
      }, 5000);

      await checkInTxn.wait();
      // Clear the pending confirmation toast if transaction is already confirmed
      clearTimeout(pendingToastId);
      setCheckInTxnPending1(false);

      showSuccessToastWithReactNode(
        "成功",
        <a
          href={`https://mumbai.polygonscan.com/tx/${checkInTxn.hash}`}
          target="_blank"
          rel="nofollow noreferrer"
        >
          在區塊鏈瀏覽器確認交易！
        </a>
      );
    } catch (err) {
      console.log(err);
      setCheckInTxnPending1(false);
      showErrorToast("錯誤", "蒐集發生錯誤,請向工作人員尋求人工協助");
    }
  };

  /**
   * Trigger smart contract checkInStage2 function.
   * This function is used to check in the user and mark them as attended the stage2.
   */
  const checkIn2 = async () => {
    try {
      if (!connectedContract) return;

      setCheckInTxnPending2(true);
      const checkInTxn = await connectedContract.checkInStage2(scannedAddress);

      // Show pending confirmation toast after 5 seconds
      const pendingToastId = setTimeout(() => {
        showInfoToastWithReactNode(
          "已送出交易",
          <a
            href={`https://mumbai.polygonscan.com/tx/${checkInTxn.hash}`}
            target="_blank"
            rel="nofollow noreferrer"
          >
            交易已送出，在區塊鏈瀏覽器確認進度！
          </a>
        );
      }, 5000);

      await checkInTxn.wait();
      // Clear the pending confirmation toast if transaction is already confirmed
      clearTimeout(pendingToastId);
      setCheckInTxnPending2(false);
      showSuccessToastWithReactNode(
        "成功",
        <a
          href={`https://mumbai.polygonscan.com/tx/${checkInTxn.hash}`}
          target="_blank"
          rel="nofollow noreferrer"
        >
          在區塊鏈瀏覽器確認交易！
        </a>
      );
    } catch (err) {
      console.log(err);
      setCheckInTxnPending2(false);
      showErrorToast("錯誤", "蒐集發生錯誤,請向工作人員尋求人工協助");
    }
  };

  /**
   * Using user wallet address to trigger smart contract balanceOf function
   * Ensure user has ticket before check in stage
   */
  useEffect(() => {
    const confirmOwnership = async () => {
      try {
        console.log("confirmOwnership collect", connectedContract);
        if (!connectedContract) return;

        const res = await connectedContract.balanceOf(scannedAddress);
        console.log("Collect", res);
        if (res > 0) {
          console.log(res);
          setHasTicket(true);
        }

        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };

    if (scannedAddress) {
      confirmOwnership();
    }
  }, [connectedContract, scannedAddress]);

  return (
    <>
      <Heading mb={4}>Collect</Heading>
      {!showScanner && scannedAddress && hasTicket && (
        <>
          <Text fontSize="xl" mb={8}>
            此錢包可進行蒐集闖關!
          </Text>
          <Flex width="100%" justifyContent="center">
            <Button
              onClick={checkIn1}
              isLoading={checkInTxnPending1}
              size="lg"
              colorScheme="teal"
            >
              Collect1
            </Button>
            <Divider orientation="vertical" />
            <Button
              onClick={checkIn2}
              isLoading={checkInTxnPending2}
              size="lg"
              colorScheme="teal"
            >
              Collect2
            </Button>
          </Flex>
        </>
      )}
      {!showScanner && (
        <>
          {!scannedAddress && (
            <Text fontSize="xl" mb={8}>
              掃描錢包地址確認進行蒐集
            </Text>
          )}
          {scannedAddress && !hasTicket && (
            <Text fontSize="xl" mb={8}>
              這個錢包沒有持有此活動票券!
            </Text>
          )}
          {!hasTicket && (
            <Flex width="100%" justifyContent="center">
              <Button
                onClick={() => setShowScanner(true)}
                size="lg"
                colorScheme="purple"
              >
                掃描 QR Code
              </Button>
            </Flex>
          )}
        </>
      )}
      {showScanner && (
        <>
          <Box padding="0" margin="0" width="100%">
            <QrReader
              delay={3000}
              facingMode="environment"
              style={{
                width: "100%",
                margin: "0",
              }}
              onError={(error:any) => {
                console.log(error);
                showErrorToast("錯誤", "無法讀取 QR Code");
                setShowScanner(false);
              }}
              onScan={(data:any) => {
                if (!data) return;
                console.log("onScan",data);
                // const address = data.text.split("ethereum:");
                const address = data.text.substr(9, 42);
                console.log(address);
                setScannedAddress(address);
                setShowScanner(false);
                showSuccessToast(
                  "掃描成功!",
                  `${address.slice(0, 6)}
                      ...${address.slice(-4)}`
                );
              }}
            />
          </Box>
          <Flex
            width="100%"
            justifyContent="center"
            margin="16px auto 8px auto"
          >
            <Button
              onClick={() => setShowScanner(false)}
              size="lg"
              colorScheme="red"
            >
              Cancel
            </Button>
          </Flex>
        </>
      )}
    </>
  );
}

export default Collect;