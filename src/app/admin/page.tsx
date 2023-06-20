"use client";
import { useState } from "react";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import useCustomToast from "../../../components/hooks/useCustomToast";
import { nfTixBooth } from "../../../contracts/abis/nfTixBooth";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useAccount,
} from "wagmi";
import { useIsMounted } from "../hooks/useIsMounted";

const index = () => {
  const { showSuccessToastWithReactNode, showErrorToast } = useCustomToast();
  // const [openSaleTxnPending, setOpenSaleTxnPending] = useState<boolean>(false);
  // const [closeSaleTxnPending, setCloseSaleTxnPending] =useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [saleIsActive, setsaleIsActive] = useState<boolean>(false);
  const mounted = useIsMounted();

  const { address } = useAccount();

  const { data: owner } = useContractRead({
    address: `${process.env.NEXT_PUBLIC_CONTRACT_ID}` as `0x${string}`,
    abi: nfTixBooth,
    functionName: "owner",
    onSuccess: (data) => {
      setIsOwner((data as unknown) === address);
    },
  });

  const { data: saleStatus } = useContractRead({
    address: `${process.env.NEXT_PUBLIC_CONTRACT_ID}` as `0x${string}`,
    abi: nfTixBooth,
    functionName: "saleIsActive",
    onSuccess: (data) => {
      setsaleIsActive((data as unknown) === true);
    },
  });
  console.log("saleIsActive", saleIsActive);

  const { config: openSaleCOnfig } = usePrepareContractWrite({
    address: `${process.env.NEXT_PUBLIC_CONTRACT_ID}` as `0x${string}`,
    abi: nfTixBooth,
    functionName: "openSale",
  });

  const { config: closeSaleConfig } = usePrepareContractWrite({
    address: `${process.env.NEXT_PUBLIC_CONTRACT_ID}` as `0x${string}`,
    abi: nfTixBooth,
    functionName: "closeSale",
  });

  const { write: openSale, isLoading: openSaleTxnPending } = useContractWrite({
    ...openSaleCOnfig,
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

  const { write: closeSale, isLoading: closeSaleTxnPending } = useContractWrite(
    {
      ...closeSaleConfig,
      onSuccess(data, variables, context) {
        console.log("onSuccess", data, variables, context);
        showSuccessToastWithReactNode(
          "Sale is Closed!",
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
    }
  );

  // const closeSale = async () => {
  //   try {
  //     if (!connectedContract) return;

  //     setCloseSaleTxnPending(true);
  //     let closeSaleTxn = await connectedContract.closeSale();

  //     await closeSaleTxn.wait();
  //     setCloseSaleTxnPending(false);

  //     showSuccessToastWithReactNode(
  //       "Sale is closed!",
  //       <a
  //         href={`https://mumbai.polygonscan.com/tx/${closeSaleTxn.hash}`}
  //         target="_blank"
  //         rel="nofollow noreferrer"
  //       >
  //         在區塊鏈瀏覽器確認交易！
  //       </a>
  //     );
  //   } catch (err) {
  //     console.log(err);
  //     setCloseSaleTxnPending(true);
  //     showErrorToast(
  //       "Failure",
  //       err?.toString() || "An unknown error occurred."
  //     );
  //   }
  // };

  // const openSale = async () => {
  //   try {
  //     if (!connectedContract) return;

  //     setOpenSaleTxnPending(true);
  //     let openSaleTxn = await connectedContract.openSale();

  //     await openSaleTxn.wait();
  //     setOpenSaleTxnPending(false);
  //     showSuccessToastWithReactNode(
  //       "Sale is closed!",
  //       <a
  //         href={`https://mumbai.polygonscan.com/tx/${openSaleTxn.hash}`}
  //         target="_blank"
  //         rel="nofollow noreferrer"
  //       >
  //         在區塊鏈瀏覽器確認交易！
  //       </a>
  //     );
  //   } catch (err) {
  //     console.log(err);
  //     setOpenSaleTxnPending(false);
  //     showErrorToast(
  //       "Failure",
  //       err?.toString() || "An unknown error occurred."
  //     );
  //   }
  // };

  return (
    <>
      <Heading mb={4}>管理員操作</Heading>
      <Text fontSize="xl" mb={8}>
        操作智能合約開啟或關閉販售
      </Text>
      <Text fontSize="xl" mb={8}>
        當前門票銷售狀態：{saleIsActive ? "開啟" : "關閉"}
      </Text>
      <Flex width="100%" justifyContent="center">
        <Button
          disabled={!openSale}
          onClick={mounted ? () => openSale?.() : undefined}
          isLoading={openSaleTxnPending}
          isDisabled={!isOwner || closeSaleTxnPending || saleIsActive}
          size="lg"
          colorScheme="teal"
        >
          開始販售
        </Button>
        <Button
          disabled={!closeSale}
          onClick={mounted ? () => closeSale?.() : undefined}
          isLoading={closeSaleTxnPending}
          isDisabled={!isOwner || openSaleTxnPending}
          size="lg"
          colorScheme="red"
          variant="solid"
          marginLeft="24px"
        >
          關閉販售
        </Button>
      </Flex>
    </>
  );
};

export default index;
