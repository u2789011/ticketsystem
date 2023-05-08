import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import logo from "./images/devdao.svg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import {
  faQrcode,
  faTools,
  faTicketAlt,
} from "@fortawesome/free-solid-svg-icons";

import Connect from "./components/Connect";
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

import Admin from "./pages/Admin";
import Buy from "./pages/Buy";
import CheckIn from "./pages/CheckIn";
import Page from "./layouts/Page";
import Wallet from "./pages/Wallet";

import nfTixBooth from "./contracts/nfTixBooth.json";

function App() {
  const navigate = useNavigate();

  const [address, setAddress] = useState(null);
  console.log("address:", address);

  const [isOwner, setIsOwner] = useState(false);
  console.log("isOwner", isOwner);

  const [connectedContract, setConnectedContract] = useState(null);
  console.log("connectedContract", connectedContract);

  const [errorMessage, setErrorMessage] = useState(null);
  console.log("errorMessage", errorMessage);

  useEffect(() => {
    const checkIsContractOwner = async () => {
      if (!address || !connectedContract) return;

      try {
        const ownerAddress = await connectedContract.owner();
        setIsOwner(address.toLowerCase() === ownerAddress.toLowerCase());
      } catch (err) {
        setErrorMessage(err.message);
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
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner(address);
      const connectedContract = new ethers.Contract(
        process.env.REACT_APP_CONTRACT_ID,
        nfTixBooth.abi,
        signer
      );
      setConnectedContract(connectedContract);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  useEffect(() => {
    getConnectedContract();
  }, []);

  return (
    <>
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
        <Menu
          left="0"
          _hover={{
            bg: "purple.500",
            fontWeight: "bold",
          }}
        >
          {({ isOpen }) => (
            <>
              <MenuButton
                position="absolute"
                top="12px"
                right="16px"
                as={Button}
                colorScheme="purple"
                rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              >
                選單
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => navigate("/")}>
                  <Flex
                    alignItems="center"
                    flexDirection="row"
                    width="100%"
                    justifyContent="space-between"
                  >
                    購買票券
                    <FontAwesomeIcon icon={faEthereum} size="lg" />
                  </Flex>
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  isDisabled={!address}
                  onClick={() => navigate("/wallet")}
                >
                  <Flex
                    alignItems="center"
                    flexDirection="row"
                    width="100%"
                    justifyContent="space-between"
                  >
                    我的票券
                    <FontAwesomeIcon icon={faTicketAlt} size="lg" />
                  </Flex>
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  isDisabled={!isOwner}
                  onClick={() => navigate("/check-in")}
                >
                  <Flex
                    alignItems="center"
                    flexDirection="row"
                    width="100%"
                    justifyContent="space-between"
                  >
                    入場掃描
                    <FontAwesomeIcon icon={faQrcode} size="lg" />
                  </Flex>
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  isDisabled={!isOwner}
                  onClick={() => navigate("/admin")}
                >
                  <Flex
                    alignItems="center"
                    flexDirection="row"
                    width="100%"
                    justifyContent="space-between"
                  >
                    設定
                    <FontAwesomeIcon icon={faTools} size="lg" />
                  </Flex>
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
            src={logo}
            alt="DevDAO logo"
            margin="36px auto 12px"
            width="15%"
          />
          <Routes>
            <Route
              path="/"
              element={<Buy connectedContract={connectedContract} />}
            />

            <Route
              path="/check-in"
              element={<CheckIn connectedContract={connectedContract} />}
            />

            <Route
              path="/admin"
              element={
                <Admin
                  isOwner={isOwner}
                  connectedContract={connectedContract}
                />
              }
            />

            <Route path="/wallet" element={<Wallet address={address} />} />
          </Routes>
        </Flex>
      </Page>
      {errorMessage && (
        <Flex mt={4} color="red.500" fontWeight="bold">
          <p>{errorMessage.message}</p>
        </Flex>
      )}
    </>
  );
}

export default App;
