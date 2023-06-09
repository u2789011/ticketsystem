"use client";
import { useEffect, useState, createContext } from "react";
import { Contract, ethers } from "ethers";
import Link from "next/link";

import nfTixBooth from "../../contracts/nfTixBooth.json";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import {
  faQrcode,
  faTools,
  faTicketAlt,
} from "@fortawesome/free-solid-svg-icons";

import Page from "../../components/Layout";
import Connect from "../../components/Connect";
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

type Props = {
  children: any;
};

type Context = {
  address: string | null | undefined;
  isOwner: boolean;
  connectedContract: Contract | null;
};
export const HomeContext = createContext<Context | undefined>(undefined);

export default function Home({ children }: Props) {
  const [address, setAddress] = useState<string | null | undefined>(null);
  console.log("address:", address);

  const [isOwner, setIsOwner] = useState(false);
  console.log("isOwner", isOwner);

  const [connectedContract, setConnectedContract] = useState<any>(null);
  console.log("connectedContract", connectedContract);

  const [errorMessage, setErrorMessage] = useState<string>("");
  console.log("errorMessage", errorMessage);



  useEffect(() => {
    const checkIsContractOwner = async () => {
      if (!address || !connectedContract) return;

      try {
        const ownerAddress = await connectedContract.owner();
        setIsOwner(address.toLowerCase() === ownerAddress.toLowerCase());
      } catch (err: any) {
        // Check if err is an Error object with a message property.
        if (err instanceof Error && err.message) {
          setErrorMessage(err.message);
        } else {
          // If not, use a generic error message.
          setErrorMessage("An unknown error occurred.");
        }
      }
    };
    checkIsContractOwner();
  }, [address, connectedContract]);

  useEffect(() => {
    if (!address) {
      const previousAddress = window.localStorage.getItem("nftix-address");

      if (previousAddress) {
        setAddress(previousAddress);
      }
    }
  }, [address]);

  useEffect(() => {
    const { ethereum } = window;
    const handleNetworkChange = () => {
      getConnectedContract();
    };

    ethereum.on("networkChanged", handleNetworkChange);

    return () => {
      ethereum.removeListener("networkChanged", handleNetworkChange);
    };
  }, [address, connectedContract]);

  const getConnectedContract = async () => {
    const { ethereum } = window;
    if (!ethereum) return;

    try {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const connectedContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ID as string,
        nfTixBooth.abi,
        signer
      );
      setConnectedContract(connectedContract);
    } catch (err: any) {
      // Check if err is an Error object with a message property.
      if (err instanceof Error && err.message) {
        setErrorMessage(err.message);
        console.log("setConnectedContract err.message", err.message);
      } else {
        // If not, use a generic error message.
        setErrorMessage("An unknown error occurred.");
      }
    }
  };

  useEffect(() => {
    getConnectedContract();
    console.log("getConnectedContract", connectedContract)
  }, []);

  return (
    <HomeContext.Provider value={{ address, isOwner, connectedContract }}>
      <Connect
        address={address}
        onConnect={(address) => {
          setAddress(address);

          window.localStorage.setItem("nftix-address", address);
        }}
        onDisconnect={() => {
          setAddress(null);

          window.localStorage.removeItem("nftix-address");
        }}
      />
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
          />
          {/* show buy page */}
          {/* <Buy connectedContract={connectedContract} /> */}
          {children}
        </Flex>
      </Page>
      {errorMessage && (
        <Flex mt={4} color="red.500" fontWeight="bold">
          <p>{errorMessage}</p>
        </Flex>
      )}
    </HomeContext.Provider>
  );
}
