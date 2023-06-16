"use client";
import { useState, useContext } from "react";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { HomeContext } from "../home";
import useCustomToast from "../../../components/hooks/useCustomToast";

const index = () => {
  const context = useContext(HomeContext);
  if (context === undefined) {
    throw new Error("useContext undefined");
  }
  const { connectedContract, isOwner } = context;
  const { showSuccessToastWithReactNode, showErrorToast } = useCustomToast();
  const [openSaleTxnPending, setOpenSaleTxnPending] = useState<boolean>(false);

  const [closeSaleTxnPending, setCloseSaleTxnPending] =
    useState<boolean>(false);

  const closeSale = async () => {
    try {
      if (!connectedContract) return;

      setCloseSaleTxnPending(true);
      let closeSaleTxn = await connectedContract.closeSale();

      await closeSaleTxn.wait();
      setCloseSaleTxnPending(false);

      showSuccessToastWithReactNode(
        "Sale is closed!",
        <a
          href={`https://mumbai.polygonscan.com/tx/${closeSaleTxn.hash}`}
          target="_blank"
          rel="nofollow noreferrer"
        >
          在區塊鏈瀏覽器確認交易！
        </a>
      );
    } catch (err) {
      console.log(err);
      setCloseSaleTxnPending(true);
      showErrorToast(
        "Failure",
        err?.toString() || "An unknown error occurred."
      );
    }
  };

  const openSale = async () => {
    try {
      if (!connectedContract) return;

      setOpenSaleTxnPending(true);
      let openSaleTxn = await connectedContract.openSale();

      await openSaleTxn.wait();
      setOpenSaleTxnPending(false);
      showSuccessToastWithReactNode(
        "Sale is closed!",
        <a
          href={`https://mumbai.polygonscan.com/tx/${openSaleTxn.hash}`}
          target="_blank"
          rel="nofollow noreferrer"
        >
          在區塊鏈瀏覽器確認交易！
        </a>
      );
    } catch (err) {
      console.log(err);
      setOpenSaleTxnPending(false);
      showErrorToast(
        "Failure",
        err?.toString() || "An unknown error occurred."
      );
    }
  };

  return (
    <>
      <Heading mb={4}>管理員操作</Heading>
      <Text fontSize="xl" mb={8}>
        操作智能合約開啟或關閉販售
      </Text>
      <Flex width="100%" justifyContent="center">
        <Button
          isLoading={openSaleTxnPending}
          onClick={openSale}
          isDisabled={!isOwner || closeSaleTxnPending}
          size="lg"
          colorScheme="teal"
        >
          開始販售
        </Button>
        <Button
          onClick={closeSale}
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
