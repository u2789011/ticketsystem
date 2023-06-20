"use client";
import { useEffect, useState, createContext } from "react";
import { Contract, ethers } from "ethers";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import {
  faQrcode,
  faTools,
  faTicketAlt,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";

import Page from "../../components/Layout";
import {
  Button,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useContractRead } from "wagmi";
import { nfTixBooth } from "../../contracts/abis/nfTixBooth";

type Props = {
  children: any;
};

export default function Home({ children }: Props) {
  const { address } = useAccount();
  console.log("address:", address);

  const { data: owner } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ID as `0x${string}`,
    abi: nfTixBooth,
    functionName: "owner",
  });

  let isOwner = address === owner;
  console.log(isOwner);

  const [errorMessage, setErrorMessage] = useState<string>("");
  console.log("errorMessage", errorMessage);

  return (
    <>
      <Flex
        fontWeight="bold"
        position="absolute"
        top="8px"
        right="8px"
        zIndex="10"
      >
        <ConnectButton label="連結錢包" />
      </Flex>
      <Page>
        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton
                position="absolute"
                top="12px"
                right="16px"
                as={Button}
                colorScheme="purple"
                style={{ backgroundColor: "purple !important" }}
                rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              >
                選單
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <Link href="/">
                    <Flex
                      alignItems="center"
                      flexDirection="row"
                      width="100%"
                      justifyContent="space-between"
                    >
                      購買票券
                      <FontAwesomeIcon icon={faEthereum} size="lg" />
                    </Flex>
                  </Link>
                </MenuItem>
                <MenuDivider />
                <MenuItem isDisabled={!address}>
                  <Link href="/wallet">
                    <Flex
                      alignItems="center"
                      flexDirection="row"
                      width="100%"
                      justifyContent="space-between"
                    >
                      我的票券
                      <FontAwesomeIcon icon={faTicketAlt} size="lg" />
                    </Flex>
                  </Link>
                </MenuItem>
                <MenuDivider />
                <MenuItem isDisabled={!isOwner}>
                  <Link href="/checkin">
                    <Flex
                      alignItems="center"
                      flexDirection="row"
                      width="100%"
                      justifyContent="space-between"
                    >
                      入場掃描
                      <FontAwesomeIcon icon={faQrcode} size="lg" />
                    </Flex>
                  </Link>
                </MenuItem>
                <MenuDivider />
                <MenuItem isDisabled={false}>
                  <Link href="/collect">
                    <Flex
                      alignItems="center"
                      flexDirection="row"
                      width="100%"
                      justifyContent="space-between"
                    >
                      蒐集掃描
                      <FontAwesomeIcon icon={faWallet} size="lg" />
                    </Flex>
                  </Link>
                </MenuItem>
                <MenuDivider />
                <MenuItem isDisabled={!isOwner}>
                  <Link href="admin">
                    <Flex
                      alignItems="center"
                      flexDirection="row"
                      width="100%"
                      justifyContent="space-between"
                    >
                      設定
                      <FontAwesomeIcon icon={faTools} size="lg" />
                    </Flex>
                  </Link>
                </MenuItem>
              </MenuList>
            </>
          )}
        </Menu>
        <Flex
          alignItems="flex-start"
          flex="1 1 auto"
          flexDirection="column"
          justifyContent="center"
          width="100%"
        >
          <Image
            src="/devdao.svg"
            alt="DevDAO logo"
            margin="36px auto 12px"
            width="15%"
            height="15%"
          />
          {children}
        </Flex>
      </Page>
      {errorMessage && (
        <Flex mt={4} color="red.500" fontWeight="bold">
          <p>{errorMessage}</p>
        </Flex>
      )}
    </>
  );
}
