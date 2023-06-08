"use client"

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

// @ts-ignore
import axios from "axios";

function Wallet({ address }: any) {
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [ticket, setTicket] = useState<[any] | null>(null);

  const createTicketDisplay = (ticket: any) => {
    // const pinataURI = "https://gateway.pinata.cloud/ipfs/";
    // console.log("ticket.contract.address", ticket.contract.address);
    // console.log("process.env.REACT_APP_CONTRACT_ID", process.env.REACT_APP_CONTRACT_ID)
    // console.log(ticket.contract.address.toString() !== process.env.REACT_APP_CONTRACT_ID);
    if (ticket.contract.address.toLowerCase() !== process.env.REACT_APP_CONTRACT_ID?.toLowerCase()) return;
    console.log("ticket", ticket);
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
  const baseURL = `https://polygon-mumbai.g.alchemy.com/nft/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}/getNFTs`;
  const url = `${baseURL}?contractAddress=${process.env.REACT_APP_CONTRACT_ID}&owner=${address}`;
  const config = {
    method: "get",
    url: url,
  };

  useEffect(() => {
    if (!address) return;
    axios(config)
      // .get(
      //   // `https://testnets-api.opensea.io/api/v1/assets?owner=${address}&asset_contract_address=${process.env.REACT_APP_CONTRACT_ID}`
      // )
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
      .catch((err : Error) => {
        console.log(err);
        setLoadingTicket(false);
      });
  }, [address]);
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
        {!loadingTicket && ticket && ticket?.map(createTicketDisplay)}
        {!loadingTicket && !ticket && (
          <Text fontSize="xl" mb={2} width="100%">
            尚未擁有任何票券 😢
          </Text>
        )}
      </Flex>
    </>
  );
}

export default Wallet;

