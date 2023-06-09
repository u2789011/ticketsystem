"use client"
import { useState, useContext } from "react";
import { Button, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { Contract, ethers } from "ethers";
import { HomeContext } from "../home";

const index = () => {
  const context = useContext(HomeContext);
  if (context === undefined) {
    throw new Error("useContext undefined");
  }
  const { connectedContract, isOwner } = context;
  const toast = useToast();
  const [openSaleTxnPending, setOpenSaleTxnPending] = useState(false);

  const [closeSaleTxnPending, setCloseSaleTxnPending] = useState(false);

  const closeSale = async () => {
    try {
      if (!connectedContract) return;

      setCloseSaleTxnPending(true);
      let closeSaleTxn = await connectedContract.closeSale();

      await closeSaleTxn.wait();
      setCloseSaleTxnPending(false);

      toast({
        status: "success",
        title: "Sale is closed!",
        variant: "subtle",
        description: (
          <a
            href={`https://mumbai.polygonscan.com/tx/${closeSaleTxn.hash}`}
            target="_blank"
            rel="nofollow noreferrer"
          >
            在區塊鏈瀏覽器確認交易！
          </a>
        ),
      });
    } catch (error) {
      console.log(error);
      setCloseSaleTxnPending(true);
      toast({
        title: "Failure",
        description: error?.toString(),
        status: "error",
        variant: "subtle",
      });
    }
  };

  const openSale = async () => {
    try {
      if (!connectedContract) return;

      setOpenSaleTxnPending(true);
      let openSaleTxn = await connectedContract.openSale();

      await openSaleTxn.wait();
      setOpenSaleTxnPending(false);

      toast({
        status: "success",
        title: "Sale is open!",
        variant: "subtle",
        description: (
          <a
            href={`https://mumbai.polygonscan.com/tx/${openSaleTxn.hash}`}
            target="_blank"
            rel="nofollow noreferrer"
          >
            在區塊鏈瀏覽器確認交易！
          </a>
        ),
      });
    } catch (error) {
      console.log(error);
      setOpenSaleTxnPending(false);
      toast({
        title: "Failure",
        description: error?.toString(),
        status: "error",
        variant: "subtle",
      });
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
  )
}

export default index
