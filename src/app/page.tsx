"use client";
import { useState } from "react";
import {
  Button,
  ButtonGroup,
  Heading,
  Text,
  Flex,
  Select,
  CircularProgress,
} from "@chakra-ui/react";
import useCustomToast from "../../components/hooks/useCustomToast";

import { useContractReads } from "wagmi";
import { nfTixBooth } from "../../contracts/abis/nfTixBooth";
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useAccount,
} from "wagmi";
import { useIsMounted } from "./hooks/useIsMounted";

const Buy = () => {
  const { showSuccessToastWithReactNode, showErrorToast, showWarningToast } =
    useCustomToast();
  const [currentOption, setCurrentOption] = useState<string | null>(null);
  const [buyTxnPending, setBuyTxnPending] = useState<boolean>(false);

  // Check if mounted to deal with hydration error
  const mounted = useIsMounted();

  // Check if user has already bought ticket
  const { address: currentAddress } = useAccount();
  const { data: balanceOfData } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ID as `0x${string}`,
    abi: nfTixBooth,
    functionName: "balanceOf",
    args: [currentAddress],
    enabled: currentAddress ? true : false,
  });

  // Wagmi contract reads for available tickets
  const {
    data: availableTickets,
    isError: isErrorAvailableTickets,
    isLoading: isLoadingAvailableTickets,
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

  // Configure Buy Ticket Writes
  const { config: configBuyA } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ID as `0x${string}`,
    abi: nfTixBooth,
    functionName: "mintA",
    value: BigInt(`${0.001 * 10 ** 18}`),
    enabled: !balanceOfData ? true : false,
  });

  const { config: configBuyB } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ID as `0x${string}`,
    abi: nfTixBooth,
    functionName: "mintB",
    value: BigInt(`${0.002 * 10 ** 18}`),
    enabled: !balanceOfData ? true : false,
  });

  const { config: configBuyC } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ID as `0x${string}`,
    abi: nfTixBooth,
    functionName: "mintC",
    value: BigInt(`${0.003 * 10 ** 18}`),
    enabled: !balanceOfData ? true : false,
  });

  const { data: dataA, write: buyA } = useContractWrite(configBuyA);
  const { data: dataB, write: buyB } = useContractWrite(configBuyB);
  const { data: dataC, write: buyC } = useContractWrite(configBuyC);

  const buyTicket = async () => {
    try {
      setBuyTxnPending(true);
      let buyTxn;
      if (currentOption === "option1") {
        buyA?.();
        buyTxn = dataA?.hash;
      } else if (currentOption === "option2") {
        buyB?.();
        buyTxn = dataB?.hash;
      } else if (currentOption === "option3") {
        buyC?.();
        buyTxn = dataC?.hash;
      } else {
        throw new Error("Invalid option");
      }

      setBuyTxnPending(false);

      showSuccessToastWithReactNode(
        "成功",
        <a
          href={mounted ? `https://mumbai.polygonscan.com/tx/${buyTxn}` : ""}
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
            onClick={mounted ? buyTicket : undefined}
            isLoading={buyTxnPending}
            loadingText="Pending"
            size="lg"
            colorScheme="teal"
            style={{ backgroundColor: "teal !important" }}
          >
            購買票券
          </Button>
        </ButtonGroup>
        {mounted && availableTickets && !availableTickets[0].error ? (
          <Text>
            總共 {Number(availableTickets[0].result)} 張票
            <br />
            A區還剩 {Number(availableTickets[1].result)} 張！
            <br />
            B區還剩 {Number(availableTickets[2].result)} 張！
            <br />
            C區還剩 {Number(availableTickets[3].result)} 張！
          </Text>
        ) : (
          <></>
        )}
        {mounted && isLoadingAvailableTickets && (
          <CircularProgress
            capIsRound
            isIndeterminate
            color="green.300"
            size="120px"
          />
        )}
      </Flex>
    </>
  );
};

export default Buy;
