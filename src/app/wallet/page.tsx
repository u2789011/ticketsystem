"use client";

import {
  Box,
  CircularProgress,
  Flex,
  Image,
  Heading,
  Link,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useIsMounted } from "../hooks/useIsMounted";

// @ts-ignore
import axios from "axios";

function Wallet() {
  const { address } = useAccount();
  const [loadingTicket, setLoadingTicket] = useState<boolean>(true);
  const [ticket, setTicket] = useState<[any] | null>(null);
  const mounted = useIsMounted();

  const createTicketDisplay = (ticket: any) => {
    // const pinataURI = "https://gateway.pinata.cloud/ipfs/";
    // console.log("ticket.contract.address", ticket.contract.address);
    // console.log("process.env.REACT_APP_CONTRACT_ID", process.env.REACT_APP_CONTRACT_ID)
    // console.log(ticket.contract.address.toString() !== process.env.REACT_APP_CONTRACT_ID);
    return (
      <Link
        href={ticket.metadata.image}
        key={ticket.id.tokenId}
        isExternal
        width="100%"
        margin="16px 8px"
      >
        <Text fontSize="xl" textAlign="center" mb={2}>
          票券名稱：{ticket.metadata.name}
        </Text>
        <Box padding="12px" border="1px solid black" borderRadius="12px">
          <Image src={ticket.metadata.image} alt={ticket.metadata.name} />
        </Box>
      </Link>
    );
  };

  // Alchemy URL
  const baseURL = `https://polygon-mumbai.g.alchemy.com/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/getNFTs`;
  const url = mounted
    ? `${baseURL}?contractAddress=${process.env.NEXT_PUBLIC_CONTRACT_ID}&owner=${address}`
    : "";
  const config = {
    method: "get",
    url: url,
  };

  useEffect(() => {
    if (!address) return;
    axios(config)
      .then((res: any) => {
        setLoadingTicket(true);
        console.log("res", res);
        if (
          res.status === 200 &&
          res?.data?.ownedNfts &&
          res?.data?.ownedNfts.length
        ) {
          setTicket(res.data.ownedNfts);
        }
        setLoadingTicket(false);
      })
      .catch((err: Error) => {
        console.log(err);
        setLoadingTicket(false);
      });
  }, [address]);

  /**
   * Filter the ticket which contract address is the same as the contract address in .env
   */
  let validTickets = [];
  if (!loadingTicket && ticket) {
    validTickets = ticket.filter(
      (t) =>
        t.contract.address.toLowerCase() ===
        process.env.NEXT_PUBLIC_CONTRACT_ID?.toLowerCase()
    );
  }
  console.log(validTickets);
  return (
    <>
      <Heading mb={2}>我的票券</Heading>
      <Flex justifyContent="center" margin="0 auto 16px" width="66%">
        {loadingTicket && (
          <CircularProgress
            capIsRound
            isIndeterminate
            color="green.300"
            size="120px"
          />
        )}
        {!loadingTicket &&
          validTickets.length > 0 &&
          validTickets.map(createTicketDisplay)}
        {!loadingTicket && validTickets.length === 0 && (
          <Text fontSize="xl" mb={2} width="100%">
            尚未擁有任何票券 😢
          </Text>
        )}
      </Flex>
    </>
  );
}

export default Wallet;
