"use client";
import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Heading,
  Text,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { Contract, ethers } from "ethers";

type IndexProps = {
  connectedContract: Contract | null;
};

const Buy = ({ connectedContract }: IndexProps) => {
  console.log("BUY, connectedContract", connectedContract)
  const toast = useToast();
  const [totalTicketCount, setTotalTicketCount] = useState<number|null>(null);
  console.log(totalTicketCount)

  const [availableTicketCountA, setAvailableTicketCountA] = useState<number|null>(null);
  const [availableTicketCountB, setAvailableTicketCountB] = useState<number|null>(null);
  const [availableTicketCountC, setAvailableTicketCountC] = useState<number|null>(null);

  const [buyTxnPending, setBuyTxnPending] = useState(false);

  useEffect(() => {
    if (!connectedContract) return;

    getAvailableTicketCountA();
    getAvailableTicketCountB();
    getAvailableTicketCountC();
    getTotalTicketCount();
  });

  const buyTicket = async () => {
    try {
      if (!connectedContract) return;

      setBuyTxnPending(true);
      const buyTxn = await connectedContract.mintA({
        value: `${0.001 * 10 ** 18}`,
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
        // if (err.code === ethers.errors.USER_REJECTED) {
        //   toast({
        //     title: "使用者拒絕簽署交易",
        //     description: "請同意簽署本次購買票券之交易",
        //     status: "warning",
        //     variant: "subtle",
        //   });
        // } else if (err.code === 2000) {
        //   toast({
        //     title: "餘額不足",
        //     description: "請加值您的錢包餘額",
        //     status: "warning",
        //     variant: "subtle",
        //   });
        // } else {
        //   toast({
        //     title: "錯誤",
        //     description: "交易錯誤, 請通知系統管理員",
        //     status: "error",
        //     variant: "subtle",
        //   });
        // }

      setBuyTxnPending(false);


    }
  };

  const getAvailableTicketCountA = async () => {
    try {
      const count = await connectedContract?.availableTicketsA();
      console.log("connectedContract.availableTicketsA()",count)
  
      if (count) {
        setAvailableTicketCountA(Number(count));
      } else {
        console.error("Unexpected result from availableTicketsA: ", count);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getAvailableTicketCountB = async () => {
    try {
      const count = await connectedContract?.availableTicketsB();
      console.log("connectedContract.availableTicketsB()",count)
  
      if (count) {
        setAvailableTicketCountB(Number(count));
      } else {
        console.error("Unexpected result from availableTicketsA: ", count);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getAvailableTicketCountC = async () => {
    try {
      const count = await connectedContract?.availableTicketsC();
      console.log("connectedContract.availableTicketsC()",count)
  
      if (count) {
        setAvailableTicketCountC(Number(count));
      } else {
        console.error("Unexpected result from availableTicketsC: ", count);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getTotalTicketCount = async () => {
    try {
      const count = await connectedContract?.TOTAL_TICKETS();
      console.log("connectedContract.TOTAL_TICKETS()",count)
      setTotalTicketCount(Number(count));
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
            style={{ backgroundColor: "teal !important" }}
          >
            購買票券
          </Button>

        </ButtonGroup>
        {availableTicketCountA && totalTicketCount && (
          <Text>
            總共 {totalTicketCount} 張票
            <br />
            A區還剩 {availableTicketCountA} 張！
            <br />
            B區還剩 {availableTicketCountB} 張！
            <br />
            C區還剩 {availableTicketCountC} 張！
          </Text>
        )}
      </Flex>
    </>
  );
};

export default Buy;
