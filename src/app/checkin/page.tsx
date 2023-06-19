"use client";

import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useState } from "react";
// import { HomeContext } from "../home";
import useCustomToast from "../../../components/hooks/useCustomToast";
// @ts-ignore
import QrReader from "react-qr-scanner";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { nfTixBooth } from "../../../contracts/abis/nfTixBooth";

function CheckIn() {
  // const context = useContext(HomeContext);
  // if (context === undefined) {
  //   throw new Error("useContext undefined");
  // }
  // const { connectedContract } = context;
  const { showSuccessToast, showSuccessToastWithReactNode, showErrorToast } =
    useCustomToast();
  const [showScanner, setShowScanner] = useState<boolean>(false);
  // const [data, setData] = useState("No result");
  const [scannedAddress, setScannedAddress] = useState(null);

  const [hasTicket, setHasTicket] = useState<boolean>(false);

  // const [checkInTxnPending, setCheckInTxnPending] = useState<boolean>(false);

  const balanceOf = useContractRead({
    address: `${process.env.NEXT_PUBLIC_CONTRACT_ID}` as `0x${string}`,
    abi: nfTixBooth,
    functionName: "balanceOf",
    args: [scannedAddress],
    enabled: scannedAddress ? true : false,
    onSuccess: (data) => {
      Number(data) > 0 ? setHasTicket(true) : setHasTicket(false);
    },
  });

  const { data } = useContractRead({
    address: `${process.env.NEXT_PUBLIC_CONTRACT_ID}` as `0x${string}`,
    abi: nfTixBooth,
    functionName: "balanceOf",
    args: [scannedAddress],
    enabled: scannedAddress ? true : false,
    onSuccess: (data) => {
      Number(data) > 0 ? setHasTicket(true) : setHasTicket(false);
    },
  });

  const { config: checkInConfig } = usePrepareContractWrite({
    address: `${process.env.NEXT_PUBLIC_CONTRACT_ID}` as `0x${string}`,
    abi: nfTixBooth,
    functionName: "checkIn",
    enabled: scannedAddress ? true : false,
    args: [scannedAddress],
  });

  const { write: checkIn, isLoading: checkInTxnPending } = useContractWrite({
    ...checkInConfig,
    onSuccess(data, variables, context) {
      console.log("onSuccess", data, variables, context);
      showSuccessToastWithReactNode(
        "Sale is Opened!",
        <a
          href={`https://mumbai.polygonscan.com/tx/${data.hash}`}
          target="_blank"
          rel="nofollow noreferrer"
        >
          在區塊鏈瀏覽器確認交易！
        </a>
      );
    },
    onError(error, variables, context) {
      console.log("onError", error, variables, context);
      showErrorToast(
        "Failure",
        error?.message ?? "Something went wrong, please try again later."
      );
    },
  });

  // const checkIn = async () => {
  //   try {
  //     if (!connectedContract) return;

  //     setCheckInTxnPending(true);
  //     const checkInTxn = await connectedContract.checkIn(scannedAddress);

  //     await checkInTxn.wait();
  //     setCheckInTxnPending(false);

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
  //   } catch (err) {
  //     console.log(err);
  //     setCheckInTxnPending(false);
  //     showErrorToast("錯誤", "CheckIn入場錯誤,請向工作人員尋求人工協助");
  //   }
  // };

  // useEffect(() => {
  // const confirmOwnership = async () => {
  //   try {
  //     console.log(connectedContract);
  //     if (!connectedContract) return;

  //     const res = await connectedContract.balanceOf(scannedAddress);
  //     console.log(res > 0);
  //     if (res > 0) setHasTicket(true);

  //     console.log(res);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // if (scannedAddress) {
  //   confirmOwnership();
  // }
  // refetchBalanceData();
  // refetchWriteParam();

  // }, [scannedAddress]);

  return (
    <>
      <Heading mb={4}>Check In</Heading>
      {!showScanner && scannedAddress && hasTicket && (
        <>
          <Text fontSize="xl" mb={8}>
            此錢包擁有票券可入場!
          </Text>
          <Flex width="100%" justifyContent="center">
            <Button
              onClick={() => checkIn?.()}
              isLoading={checkInTxnPending}
              size="lg"
              colorScheme="teal"
            >
              Check In
            </Button>
          </Flex>
        </>
      )}
      {!showScanner && (
        <>
          {!scannedAddress && (
            <Text fontSize="xl" mb={8}>
              掃描錢包地址確認是否有票券並完成入場
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
                colorScheme="teal"
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
              videoConstraints={{ facingMode: "environment" }}
              style={{
                width: "100%",
                margin: "0",
              }}
              onError={(err: any) => {
                console.log(err);
                showErrorToast("錯誤", "無法讀取 QR Code");
                setShowScanner(false);
              }}
              onScan={(data: any) => {
                if (!data) return;
                console.log(data);
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

export default CheckIn;
