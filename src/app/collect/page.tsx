"use client";
import { Box, Button, Flex, Heading, Text, Divider } from "@chakra-ui/react";
import { useState } from "react";
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

  let hasTicket = false;

  const { data: balanceData } = useContractRead({
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

  const { data: tokenId } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ID as `0x${string}`,
    abi: nfTixBooth,
    functionName: "tokenOfOwnerByIndex",
    args: [scannedAddress, 0],
    enabled: scannedAddress && hasTicket ? true : false,
  });
  console.log(Number(tokenId));

  const { data: isCheckedIn1 } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ID as `0x${string}`,
    abi: nfTixBooth,
    functionName: "checkedInStage1",
    args: [Number(tokenId)],
    enabled:
      scannedAddress && hasTicket && (tokenId || Number(tokenId) === 0)
        ? true
        : false,
  });

  const { data: isCheckedIn2 } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ID as `0x${string}`,
    abi: nfTixBooth,
    functionName: "checkedInStage2",
    args: [Number(tokenId)],
    enabled:
      scannedAddress && hasTicket && (tokenId || Number(tokenId) === 0)
        ? true
        : false,
  });

  console.log(isCheckedIn1, isCheckedIn2);

  const { config: configCheckIn1 } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ID as `0x${string}`,
    abi: nfTixBooth,
    functionName: "checkInStage1",
    args: [scannedAddress],
    enabled: scannedAddress && !isCheckedIn1 ? true : false,
  });

  const { config: configCheckIn2 } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ID as `0x${string}`,
    abi: nfTixBooth,
    functionName: "checkInStage2",
    args: [scannedAddress],
    enabled: scannedAddress && !isCheckedIn2 ? true : false,
  });

  const { write: writeCheckIn1, isLoading: isLoadingCheckIn1 } =
    useContractWrite(configCheckIn1);
  const { write: writeCheckIn2, isLoading: isLoadingCheckIn2 } =
    useContractWrite(configCheckIn2);

  return (
    <>
      <Heading mb={4}>Collect</Heading>
      {!showScanner && scannedAddress && hasTicket && (
        <>
          {isCheckedIn1 && isCheckedIn2 ? (
            <Text fontSize="xl" mb={8}>
              此錢包蒐集闖關已完成!
            </Text>
          ) : (
            <Text fontSize="xl" mb={8}>
              此錢包可進行蒐集闖關!
            </Text>
          )}
          <Flex width="100%" justifyContent="center">
            {!isCheckedIn1 && (
              <Button
                onClick={() => writeCheckIn1?.()}
                isLoading={isLoadingCheckIn1}
                size="lg"
                colorScheme="teal"
              >
                Collect1
              </Button>
            )}

            <Divider orientation="vertical" />
            {!isCheckedIn2 && (
              <Button
                onClick={() => writeCheckIn2?.()}
                isLoading={isLoadingCheckIn2}
                size="lg"
                colorScheme="teal"
              >
                Collect2
              </Button>
            )}
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
