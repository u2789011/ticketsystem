"use client";
import { useState } from "react";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import useCustomToast from "../../../components/hooks/useCustomToast";
import { nfTixBooth } from "../../../contracts/abis/nfTixBooth";
import {
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { useIsMounted } from "../hooks/useIsMounted";
import CheckInWhitelist from "../../../components/CheckInWhitelist";
import useSaleIsActive from "../hooks/useSaleIsActive";
import useContractOwner from "../hooks/useContractOwner";

const index = () => {
  const { showSuccessToastWithReactNode, showErrorToast } = useCustomToast();
  // const [openSaleTxnPending, setOpenSaleTxnPending] = useState<boolean>(false);
  // const [closeSaleTxnPending, setCloseSaleTxnPending] =useState<boolean>(false);
  const saleIsActive = useSaleIsActive();
  const isOwner = useContractOwner();
  const mounted = useIsMounted();

  // const { data: owner } = useContractRead({
  //   address: `${process.env.NEXT_PUBLIC_CONTRACT_ID}` as `0x${string}`,
  //   abi: nfTixBooth,
  //   functionName: "owner",
  //   onSuccess: (data) => {
  //     setIsOwner((data as unknown) === address);
  //   },
  // });

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

  return (
    <>
      <Heading mb={4}>管理員操作</Heading>
      <Text fontSize="xl" mb={8}>
        操作智能合約開啟或關閉販售
      </Text>
      {mounted ? (
        <>
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
              isDisabled={!isOwner || openSaleTxnPending || !saleIsActive}
              size="lg"
              colorScheme="red"
              variant="solid"
              marginLeft="24px"
            >
              關閉販售
            </Button>
          </Flex>
        </>
      ) : (
        <></>
      )}

      <CheckInWhitelist />
    </>
  );
};

export default index;
