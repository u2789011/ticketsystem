"use client";
import { useEffect, useState, useContext } from "react";
import {
  Button,
  ButtonGroup,
  Heading,
  Text,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { Contract, ethers } from "ethers";
import { HomeContext } from "./home";

const Buy = () => {
  const context = useContext(HomeContext);
  if (context === undefined) {
    throw new Error('useContext undefined')
  }
  console.log("BUY, context", context)
  const { connectedContract } = context;
  const toast = useToast();
  const [totalTicketCount, setTotalTicketCount] = useState<number|null>(null);
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
    console.log(availableTicketCountA, availableTicketCountB, availableTicketCountC, totalTicketCount)
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
  
      if (typeof count === 'bigint') {
        setAvailableTicketCountA(Number(count));
        console.log("connectedContract.availableTicketsA()", count);
      } else {
        console.error("Unexpected result from availableTicketsA: ", count);
      }
    } catch (err: any) {
      console.error(err);
      // 在此處進行錯誤處理，例如設置一個狀態以顯示錯誤消息
    }
  };
  const getAvailableTicketCountB = async () => {
    try {
      const count = await connectedContract?.availableTicketsB();
  
      if (typeof count === 'bigint') {
        setAvailableTicketCountB(Number(count));
        console.log("connectedContract.availableTicketsB()", count);
      } else {
        console.error("Unexpected result from availableTicketsB: ", count);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const getAvailableTicketCountC = async () => {
    try {
      const count = await connectedContract?.availableTicketsC();
  
      if (typeof count === 'bigint') {
        setAvailableTicketCountC(Number(count));
        console.log("connectedContract.availableTicketsC()", count);
      } else {
        console.error("Unexpected result from availableTicketsC: ", count);
      }
    } catch (err: any) {
      console.error(err);
      // 在此處進行錯誤處理，例如設置一個狀態以顯示錯誤消息
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
        {totalTicketCount && (
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
