import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Heading,
  Text,
  Flex,
  useToast,
} from "@chakra-ui/react";

function Buy({ connectedContract }) {
  const toast = useToast();
  const [totalTicketCount, setTotalTicketCount] = useState(null);

  const [availableTicketCount, setAvailableTicketCount] = useState(null);

  const [buyTxnPending, setBuyTxnPending] = useState(false);

  useEffect(() => {
    if (!connectedContract) return;

    getAvailableTicketCount();
    getTotalTicketCount();
  });

  const buyTicket = async () => {
    try {
      if (!connectedContract) return;

      setBuyTxnPending(true);
      const buyTxn = await connectedContract.mint({
        value: `${0.08 * 10 ** 18}`,
      });

      await buyTxn.wait();
      setBuyTxnPending(false);
      toast({
        title: "Success!",
        description: (
          <a
            href={`https://goerli.etherscan.io/tx/${buyTxn.hash}`}
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
      setBuyTxnPending(false);
      toast({
        title: "Failed.",
        description: err,
        status: "error",
        variant: "subtle",
      });
    }
  };

  const getAvailableTicketCount = async () => {
    try {
      const count = await connectedContract.availableTicketCount();
      setAvailableTicketCount(count.toNumber());
    } catch (err) {
      console.log(err);
    }
  };

  const getTotalTicketCount = async () => {
    try {
      const count = await connectedContract.totalTicketCount();
      setTotalTicketCount(count.toNumber());
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Heading mb={4}>活動名稱</Heading>
      <Text fontSize="xl" mb={4}>
        請連結錢包鑄造NFT票券做為入場證明！
      </Text>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        margin="0 auto"
        maxW="140px"
      >
        <ButtonGroup mb={4}>
          <Button
            onClick={buyTicket}
            isLoading={buyTxnPending}
            loadingText="Pending"
            size="lg"
            colorScheme="teal"
          >
            購買票券
          </Button>
        </ButtonGroup>
        {availableTicketCount && totalTicketCount && (
          <Text>
            總共 {totalTicketCount} 張票
            <br />
            目前還剩 {availableTicketCount} 張！
          </Text>
        )}
      </Flex>
    </>
  );
}

export default Buy;
