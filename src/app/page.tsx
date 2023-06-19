"use client";
import { useEffect, useState, useContext } from "react";
import {
  Button,
  ButtonGroup,
  Heading,
  Text,
  Flex,
  Select,
} from "@chakra-ui/react";
import { HomeContext } from "./home";
import useCustomToast from "../../components/hooks/useCustomToast";

import { useContractReads } from "wagmi";
import { nfTixBooth } from "../../contracts/abis/nfTixBooth";
import { usePrepareContractWrite, useContractWrite } from "wagmi";

const Buy = () => {
  const context = useContext(HomeContext);
  if (context === undefined) {
    throw new Error("useContext undefined");
  }
  console.log("BUY, context", context);
  const { connectedContract } = context;
  const { showSuccessToastWithReactNode, showErrorToast, showWarningToast } =
    useCustomToast();
  // const [totalTicketCount, setTotalTicketCount] = useState<
  //   number | null | undefined
  // >(null);
  // const [availableTicketCountA, setAvailableTicketCountA] = useState<
  //   number | null | undefined
  // >(null);
  // const [availableTicketCountB, setAvailableTicketCountB] = useState<
  //   number | null | undefined
  // >(null);
  // const [availableTicketCountC, setAvailableTicketCountC] = useState<
  //   number | null | undefined
  // >(null);
  const [currentOption, setCurrentOption] = useState<string | null>(null);
  const [buyTxnPending, setBuyTxnPending] = useState<boolean>(false);

  const {
    data: availableTickets,
    isError,
    isLoading,
  } = useContractReads({
    contracts: [
      {
        address: process.env.NEXT_PUBLIC_CONTRACT_ID as `0x${string}`,
        abi: nfTixBooth,
        functionName: "TOTAL_TICKETS",
      },
      {
        address: process.env.NEXT_PUBLIC_CONTRACT_ID as `0x${string}`,
        abi: nfTixBooth,
        functionName: "availableTicketsA",
      },
      {
        address: process.env.NEXT_PUBLIC_CONTRACT_ID as `0x${string}`,
        abi: nfTixBooth,
        functionName: "availableTicketsB",
      },
      {
        address: process.env.NEXT_PUBLIC_CONTRACT_ID as `0x${string}`,
        abi: nfTixBooth,
        functionName: "availableTicketsC",
      },
    ],
  });

  console.log(availableTickets);

  // const { data, isError, isLoading } = useContractRead({
  //   address: process.env.NEXT_PUBLIC_CONTRACT_ID as `0x${string}`,
  //   abi: nfTixBooth.abi,
  //   functionName: `availableTicketsA`,
  // });
  // console.log("DATA:", Number(data));

  // useEffect(() => {
  //   if (!connectedContract) return;

  //   (async () => {
  //     const [availableA, availableB, availableC] = await Promise.all([
  //       fetchAvailableTicketCount("A"),
  //       fetchAvailableTicketCount("B"),
  //       fetchAvailableTicketCount("C"),

  //       getTotalTicketCount(),
  //     ]);

  //     setAvailableTicketCountA(availableA);
  //     setAvailableTicketCountB(availableB);
  //     setAvailableTicketCountC(availableC);
  //   })();

  // }, [connectedContract]);

  // const fetchAvailableTicketCount = async (ticketType: string) => {
  //   try {
  //     const count = await connectedContract?.[
  //       `availableTickets${ticketType}`
  //     ]();
  //     if (typeof count === "bigint") {
  //       return Number(count);
  //     } else {
  //       console.error(
  //         `Unexpected result from availableTickets${ticketType}: `,
  //         count
  //       );
  //     }
  //   } catch (err: any) {
  //     console.error(err);
  //     return null;
  //   }
  // };

  // const getTotalTicketCount = async () => {
  //   try {
  //     const count = await connectedContract?.TOTAL_TICKETS();
  //     console.log("connectedContract.TOTAL_TICKETS()", count);
  //     setTotalTicketCount(Number(count));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // Configure Buy Ticket Writes
  const { config: configBuyA, error: errorBuyA } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ID as `0x${string}`,
    abi: nfTixBooth,
    functionName: "mintA",
    value: BigInt(`${0.001 * 10 ** 18}`),
  });

  const { config: configBuyB, error: errorBuyB } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ID as `0x${string}`,
    abi: nfTixBooth,
    functionName: "mintB",
    value: BigInt(`${0.002 * 10 ** 18}`),
  });

  const { config: configBuyC, error: errorBuyC } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ID as `0x${string}`,
    abi: nfTixBooth,
    functionName: "mintC",
    value: BigInt(`${0.003 * 10 ** 18}`),
  });

  const { data: dataA, write: buyA } = useContractWrite(configBuyA);
  const { data: dataB, write: buyB } = useContractWrite(configBuyB);
  const { data: dataC, write: buyC } = useContractWrite(configBuyC);

  const buyTicket = async () => {
    try {
      if (!connectedContract) return;

      setBuyTxnPending(true);
      let buyTxn;
      if (currentOption === "option1") {
        // buyTxn = await connectedContract.mintA({
        //   value: `${0.001 * 10 ** 18}`,
        // });
        buyA?.();
        buyTxn = dataA?.hash;
      } else if (currentOption === "option2") {
        // buyTxn = await connectedContract.mintB({
        //   value: `${0.002 * 10 ** 18}`,
        // });
        buyB?.();
        buyTxn = dataB?.hash;
      } else if (currentOption === "option3") {
        // buyTxn = await connectedContract.mintC({
        //   value: `${0.003 * 10 ** 18}`,
        // });
        buyC?.();
        buyTxn = dataC?.hash;
      } else {
        throw new Error("Invalid option");
      }

      setBuyTxnPending(false);
      showSuccessToastWithReactNode(
        "成功",
        <a
          href={`https://mumbai.polygonscan.com/tx/${buyTxn}`}
          target="_blank"
          rel="nofollow noreferrer"
        >
          在區塊鏈瀏覽器確認交易！
        </a>
      );
    } catch (err: any) {
      console.log("buyTxn", err);
      console.log("buyTxn", err.code);
      if (err?.code === "ACTION_REJECTED") {
        showWarningToast("使用者拒絕簽署交易", "請同意簽署本次購買票券之交易");
      } else if (err.code === "INSUFFICIENT_FUNDS") {
        showWarningToast("餘額不足", "請加值您的錢包餘額");
      } else if (err.message.includes("Invalid option")) {
        showWarningToast("警告", "請選擇票種");
      } else {
        showErrorToast("錯誤", "交易錯誤, 請通知系統管理員.");
      }
      setBuyTxnPending(false);
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
        <ButtonGroup mb={4} size="lg">
          <Select
            placeholder="選擇票種"
            size="lg"
            onChange={(e) => setCurrentOption(e.target.value)}
          >
            <option value="option1">Ａ區</option>
            <option value="option2">Ｂ區</option>
            <option value="option3">Ｃ區</option>
          </Select>
        </ButtonGroup>
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
        {/* {totalTicketCount && (
          <Text>
            總共 {totalTicketCount} 張票
            <br />
            A區還剩 {availableTicketCountA} 張！
            <br />
            B區還剩 {availableTicketCountB} 張！
            <br />
            C區還剩 {availableTicketCountC} 張！
          </Text>
        )} */}
        {availableTickets && (
          <Text>
            總共 {Number(availableTickets[0].result)} 張票
            <br />
            A區還剩 {Number(availableTickets[1].result)} 張！
            <br />
            B區還剩 {Number(availableTickets[2].result)} 張！
            <br />
            C區還剩 {Number(availableTickets[3].result)} 張！
          </Text>
        )}
      </Flex>
    </>
  );
};

export default Buy;
