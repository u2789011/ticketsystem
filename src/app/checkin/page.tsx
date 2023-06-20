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
import { useIsMounted } from "../hooks/useIsMounted";

function CheckIn() {
  const { showSuccessToast, showSuccessToastWithReactNode, showErrorToast } =
    useCustomToast();
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [scannedAddress, setScannedAddress] = useState(null);
  const [hasTicket, setHasTicket] = useState<boolean>(false);

  const mounted = useIsMounted();

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

  const { data: tokenOfOwnerByIndex } = useContractRead({
    address: `${process.env.NEXT_PUBLIC_CONTRACT_ID}` as `0x${string}`,
    abi: nfTixBooth,
    functionName: "tokenOfOwnerByIndex",
    args: [scannedAddress, "0"],
    enabled: scannedAddress ? true : false,
    onSuccess: (data) => {
      console.log("tokenOfOwnerByIndex", data);
    },
  });

  const { data: isCheckedIn } = useContractRead({
    address: `${process.env.NEXT_PUBLIC_CONTRACT_ID}` as `0x${string}`,
    abi: nfTixBooth,
    functionName: "isCheckedIn",
    args: [Number(tokenOfOwnerByIndex)],
    enabled: scannedAddress ? true : false,
    onSuccess: (data) => {
      console.log("isCheckIn", data);
    },
  });

  const { config: checkInConfig } = usePrepareContractWrite({
    address: `${process.env.NEXT_PUBLIC_CONTRACT_ID}` as `0x${string}`,
    abi: nfTixBooth,
    functionName: "checkIn",
    enabled: scannedAddress && !isCheckedIn ? true : false,
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

  return (
    <>
      <Heading mb={4}>Check In</Heading>
      {!showScanner && scannedAddress && hasTicket && (
        <>
          {isCheckedIn ? (
            <>
              <Text fontSize="xl" mb={8}>
                此票券已經入場!
              </Text>
              <Flex
                width="100%"
                justifyContent="center"
                margin="16px auto 8px auto"
              >
                <Button
                  onClick={() => {
                    setShowScanner(false);
                    setScannedAddress(null);
                    setHasTicket(false);
                  }}
                  size="lg"
                  colorScheme="red"
                >
                  Cancel
                </Button>
              </Flex>
            </>
          ) : (
            <>
              <Text fontSize="xl" mb={8}>
                此錢包擁有票券可入場!
              </Text>
              <Flex width="100%" justifyContent="center">
                <Button
                  onClick={mounted ? () => checkIn?.() : undefined}
                  isLoading={checkInTxnPending}
                  size="lg"
                  colorScheme="teal"
                >
                  Check In
                </Button>
              </Flex>
            </>
          )}
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
