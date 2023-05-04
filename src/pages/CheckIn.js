import { Box, Button, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";

function CheckIn({ connectedContract }) {
  const toast = useToast();
  const [showScanner, setShowScanner] = useState(false);
  const [data, setData] = useState("No result");
  const [scannedAddress, setScannedAddress] = useState(null);

  const [hasTicket, setHasTicket] = useState(false);

  const [checkInTxnPending, setCheckInTxnPending] = useState(false);

  const checkIn = async () => {
    try {
      if (!connectedContract) return;

      setCheckInTxnPending(true);
      const checkInTxn = await connectedContract.checkIn(scannedAddress);

      await checkInTxn.wait();
      setCheckInTxnPending(false);

      toast({
        title: "Success!",
        description: (
          <a
            href={`https://goerli.etherscan.io/tx/${checkInTxn.hash}`}
            target="_blank"
            rel="nofollow noreferrer"
          >
            在區塊鏈瀏覽器確認交易！
          </a>
        ),
        status: "success",
        variant: "subtle",
      });
    } catch (err) {
      console.log(err);
      setCheckInTxnPending(false);
      toast({
        title: "Failed.",
        description: err,
        status: "error",
        variant: "subtle",
      });
    }
  };

  useEffect(() => {
    const confirmOwnership = async () => {
      try {
        if (!connectedContract) return;

        const res = await connectedContract.confirmOwnership(scannedAddress);

        setHasTicket(res);

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
      <Heading mb={4}>Check In</Heading>
      {!showScanner && scannedAddress && hasTicket && (
        <>
          <Text fontSize="xl" mb={8}>
            此錢包擁有票券可入場!
          </Text>
          <Flex width="100%" justifyContent="center">
            <Button
              onClick={checkIn}
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
          <Box margin="16px auto 8px auto" padding="0 16px" width="360px">
            <QrReader
              facingMode={"environment"}
              onResult={(result, error) => {
                if (!!result) {
                  setData(result?.text);
                  console.log(data);
                  const address = data.text.split("ethereum:");
                  setScannedAddress(address[1]);
                  setShowScanner(false);
                  toast({
                    title: "Captured address!",
                    description: `${address[1].slice(0, 6)}
                    ...${address[1].slice(-4)}`,
                    status: "success",
                    variant: "subtle",
                  });
                }

                if (!!error) {
                  console.info(error);
                  toast({
                    title: "Failure",
                    description: error,
                    status: "error",
                    variant: "subtle",
                  });
                  setShowScanner(false);
                }
              }}
              style={{ width: "100%" }}
            />
          </Box>
          <Flex width="100%" justifyContent="center">
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
