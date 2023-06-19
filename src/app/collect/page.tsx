"use client";
import { Box, Button, Flex, Heading, Text, Divider } from "@chakra-ui/react";
import { useEffect, useState, useContext, useCallback } from "react";
import { HomeContext } from "../home";
import useCustomToast from "../../../components/hooks/useCustomToast";
// @ts-ignore
import QrReader from "react-qr-scanner";
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
} from "wagmi";
import { nfTixBooth } from "../../../contracts/abis/nfTixBooth";

function Collect() {
  // const context = useContext(HomeContext);
  // if (context === undefined) {
  //   throw new Error("useContext undefined");
  // }
  // const { connectedContract } = context;
  const {
    showSuccessToast,
    showInfoToastWithReactNode,
    showSuccessToastWithReactNode,
    showErrorToast,
  } = useCustomToast();
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [scannedAddress, setScannedAddress] = useState<
    string | null | undefined
  >("");
  // const [hasTicket, setHasTicket] = useState<boolean>(false);
  // const [checkInTxnPending1, setCheckInTxnPending1] = useState<boolean>(false);
  // const [checkInTxnPending2, setCheckInTxnPending2] = useState<boolean>(false);

  let hasTicket = false;

  const {
    data: balanceData,
    isError,
    isLoading,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ID as `0x${string}`,
    abi: nfTixBooth,
    functionName: "balanceOf",
    args: [scannedAddress],
    enabled: scannedAddress ? true : false,
  });
  console.log(balanceData);
  if (Number(balanceData) > 0) {
    hasTicket = true;
  }

  const { config: configCheckIn1, error: errorCheckIn1 } =
    usePrepareContractWrite({
      address: process.env.NEXT_PUBLIC_CONTRACT_ID as `0x${string}`,
      abi: nfTixBooth,
      functionName: "checkInStage1",
      args: [scannedAddress],
      enabled: scannedAddress ? true : false,
    });

  const { config: configCheckIn2, error: errorCheckIn2 } =
    usePrepareContractWrite({
      address: process.env.NEXT_PUBLIC_CONTRACT_ID as `0x${string}`,
      abi: nfTixBooth,
      functionName: "checkInStage2",
      args: [scannedAddress],
      enabled: scannedAddress ? true : false,
    });

  const {
    data: dataCheckIn1,
    write: writeCheckIn1,
    isLoading: isLoadingCheckIn1,
  } = useContractWrite(configCheckIn1);
  const {
    data: dataCheckIn2,
    write: writeCheckIn2,
    isLoading: isLoadingCheckIn2,
  } = useContractWrite(configCheckIn2);

  /**
   * Trigger smart contract checkInStage1,2 function.
   * This function is used to check in the user and mark them as attended the stage1,2
   */
  // const checkIn = useCallback(
  //   async (stage: number) => {
  //     // if (!connectedContract) return;
  //     // const checkInTxn = await connectedContract[`checkInStage${stage}`](
  //     //   scannedAddress
  //     // );

  //     // Show pending confirmation toast after 5 seconds
  //     const pendingToastId = setTimeout(() => {
  //       showInfoToastWithReactNode(
  //         "已送出交易",
  //         <a
  //           href={`https://mumbai.polygonscan.com/tx/${checkInTxn.hash}`}
  //           target="_blank"
  //           rel="nofollow noreferrer"
  //         >
  //           交易已送出，在區塊鏈瀏覽器確認進度！
  //         </a>
  //       );
  //     }, 5000);

  //     await checkInTxn.wait();
  //     // Clear the pending confirmation toast if transaction is already confirmed
  //     clearTimeout(pendingToastId);
  //     if (stage === 1) {
  //       setCheckInTxnPending1(false);
  //     } else if (stage === 2) {
  //       setCheckInTxnPending2(false);
  //     }

  //     showSuccessToastWithReactNode(
  //       "成功",
  //       <a
  //         href={`https://mumbai.polygonscan.com/tx/${checkInTxn.hash}`}
  //         target="_blank"
  //         rel="nofollow noreferrer"
  //       >
  //         在區塊鏈瀏覽器確認交易！
  //       </a>
  //     );
  //   },
  //   [
  //     connectedContract,
  //     scannedAddress,
  //     showInfoToastWithReactNode,
  //     showSuccessToastWithReactNode,
  //   ]
  // );

  // const checkIn1 = () => {
  //   setCheckInTxnPending1(true);

  //   checkIn(1).catch((err) => {
  //     console.log(err);
  //     setCheckInTxnPending1(false);
  //     showErrorToast("錯誤", "蒐集發生錯誤,請向工作人員尋求人工協助");
  //   });
  // };

  // const checkIn2 = () => {
  //   setCheckInTxnPending2(true);
  //   checkIn(2).catch((err) => {
  //     console.log(err);
  //     setCheckInTxnPending2(false);
  //     showErrorToast("錯誤", "蒐集發生錯誤,請向工作人員尋求人工協助");
  //   });
  // };

  /**
   * Using user wallet address to trigger smart contract balanceOf function
   * Ensure user has ticket before check in stage
   */
  // useEffect(() => {
  //   const confirmOwnership = async () => {
  //     try {
  //       console.log("confirmOwnership collect", connectedContract);
  //       if (!connectedContract) return;

  //       const res = await connectedContract.balanceOf(scannedAddress);
  //       console.log("Collect", res);
  //       if (res > 0) {
  //         console.log(res);
  //         setHasTicket(true);
  //       }

  //       console.log(res);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   if (scannedAddress) {
  //     confirmOwnership();
  //   }
  // }, [connectedContract, scannedAddress]);

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
              onClick={() => writeCheckIn1?.()}
              isLoading={isLoadingCheckIn1}
              size="lg"
              colorScheme="teal"
            >
              Collect1
            </Button>
            <Divider orientation="vertical" />
            <Button
              onClick={() => writeCheckIn2?.()}
              isLoading={isLoadingCheckIn2}
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
              onError={(error: any) => {
                console.log(error);
                showErrorToast("錯誤", "無法讀取 QR Code");
                setShowScanner(false);
              }}
              onScan={(data: any) => {
                if (!data) return;
                console.log("onScan", data);
                // const address = data.text.split("ethereum:");
                const address = data.text.substr(9, 42);
                console.log(address);
                setScannedAddress(address);
                setShowScanner(false);
                // setIsEnabled(true);
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
