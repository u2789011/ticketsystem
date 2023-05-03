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

  const createTicketDisplay = () => {
    const ticket = {
      token_id: 1,
      permalink: "https://testnets.opensea.io/zh-TW",
      image_url:
        "https://gateway.pinata.cloud/ipfs/QmTjhXx8LNw6D14weJsQ2nQjUJFAmnFz6vs9ZPkuEqZDo9/1.png",
    };
    return (
      <Link
        href={ticket.permalink}
        key={ticket.token_id}
        isExternal
        width="100%"
        margin="16px 8px"
      >
        <Text fontSize="xl" textAlign="center" mb={2}>
          票券編號 #{ticket.token_id}
        </Text>
        <Box padding="12px" border="1px solid black" borderRadius="12px">
          <Image src={ticket.image_url} alt={`NFTix #${ticket.token_id}`} />
        </Box>
      </Link>
    );
  };

  useEffect(() => {
    if (!address) return;
    axios
      .get(
        `https://testnets-api.opensea.io/api/v1/assets?owner=${address}&asset_contract_address=${process.env.REACT_APP_CONTRACT_ID}`
      )
      .then((res) => {
        setLoadingTicket(true);
        console.log(res);
        if (
          res.status === 200 &&
          res?.data?.assets &&
          res?.data?.assets.length
        ) {
          setTicket(res.data.assets[0]);
        }
        setLoadingTicket(false);
      })
      .catch((err) => {
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
        {!loadingTicket && createTicketDisplay()}
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
