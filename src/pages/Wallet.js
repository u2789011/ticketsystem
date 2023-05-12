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
import axios from "axios";

function Wallet({ address }) {
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [ticket, setTicket] = useState(null);

  const createTicketDisplay = (ticket) => {
    const pinataURI = "https://gateway.pinata.cloud/ipfs/";
    if (ticket.contract.address != process.env.REACT_APP_CONTRACT_ID) return;
    return (
      <Link
        href={ticket.permalink}
        key={ticket.id.tokenId}
        isExternal
        width="100%"
        margin="16px 8px"
      >
        <Text fontSize="xl" textAlign="center" mb={2}>
          票券名稱：{ticket.metadata.name}
        </Text>
        <Box padding="12px" border="1px solid black" borderRadius="12px">
          <Image
            src={pinataURI + ticket.metadata.image.replace("ipfs://", "")}
            alt={`NFTix #${ticket.id.tokenId}`}
          />
        </Box>
      </Link>
    );
  };

  // Alchemy URL
  const baseURL = `https://eth-Goerli.g.alchemy.com/nft/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}/getNFTs`;
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
      .then((res) => {
        setLoadingTicket(true);

        if (
          res.status === 200 &&
          res?.data?.ownedNfts &&
          res?.data?.ownedNfts.length
        ) {
          setTicket(res.data.ownedNfts);
        }
        setLoadingTicket(false);
      })
      .catch((err) => {
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
        {!loadingTicket && ticket && ticket.map(createTicketDisplay)}
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
