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
        value: `${0.01 * 10 ** 18}`,
      });

      await buyTxn.wait();
      setBuyTxnPending(false);
      toast({
        title: "成功!",
        description: (
          <a
            href={`https://mumbai.polygonscan.com/tx/${buyTxn.hash}`}
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

      if (err.code === 4001) {
        toast({
          title: "使用者拒絕簽署交易",
          description: "請同意簽署本次購買票券之交易",
          status: "warning",
          variant: "subtle",
        });
      } else if (err.code === 2000) {
        toast({
          title: "餘額不足",
          description: "請加值您的錢包餘額",
          status: "warning",
          variant: "subtle",
        });
      } else {
        toast({
          title: "錯誤",
          description: "交易錯誤, 請通知系統管理員",
          status: "error",
          variant: "subtle",
        });
      }
    }
  };

  const getAvailableTicketCount = async () => {
    try {
      const count = await connectedContract.availableTickets();
      setAvailableTicketCount(count.toNumber());
    } catch (err) {
      console.log(err);
    }
  };

  const getTotalTicketCount = async () => {
    try {
      const count = await connectedContract.TOTAL_TICKETS();
      setTotalTicketCount(count.toNumber());
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Heading mb={4}>金鴿之夜</Heading>
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
