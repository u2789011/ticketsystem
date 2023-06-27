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
import { useAccount, useContractRead } from "wagmi";
import { useIsMounted } from "../hooks/useIsMounted";
import { nfTixBooth } from "../../../contracts/abis/nfTixBooth";

// @ts-ignore
import axios from "axios";

function Wallet() {
  const { address } = useAccount();
  // const [loadingTicket, setLoadingTicket] = useState<boolean>(true);
  // const [ticket, setTicket] = useState<[any] | null>(null);
  const mounted = useIsMounted();

  const {
    data: balanceOfData,
    isLoading: balanceOfLoading,
    isError: balanceOfError,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ID as `0x${string}`,
    abi: nfTixBooth,
    functionName: "balanceOf",
    args: [address],
    enabled: address ? true : false,
  });

  console.log(Number(balanceOfData));

  const {
    data: tokenId,
    isLoading: tokenIdLoading,
    isError: tokenIdError,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ID as `0x${string}`,
    abi: nfTixBooth,
    functionName: "tokenOfOwnerByIndex",
    args: [address, 0],
    enabled: address && balanceOfData ? true : false,
  });

  console.log(Number(tokenId));

  const {
    data: tokenURI,
    isLoading: tokenURILoading,
    isError: tokenURIError,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ID as `0x${string}`,
    abi: nfTixBooth,
    functionName: "tokenURI",
    args: [Number(tokenId)],
    enabled:
      address && balanceOfData && (Number(tokenId) || Number(tokenId) === 0)
        ? true
        : false,
  });

  console.log(tokenURI);

  const [NFT, setNFT] = useState<any | null>(null);

  useEffect(() => {
    if (!tokenURI || !(tokenId || tokenId == 0)) return;
    console.log(tokenURI?.slice(0, -4) + String(tokenId));
    const config = {
      method: "get",
      url: tokenURI?.slice(0, -4) + String(tokenId),
      headers: {
        Accept: "text/plain",
      },
    };
    axios(config)
      .then((res: any) => {
        console.log("RES", res);
        if (res.status === 200 && res?.data?.name && res?.data?.image) {
          setNFT(res);
        }
      })
      .catch((err: Error) => {
        console.log(err);
      });
  }, [tokenURI, tokenId]);

  const loading = balanceOfLoading || tokenIdLoading || tokenURILoading;
  const error = balanceOfError || tokenIdError || tokenURIError;

  if (loading) {
    return (
      <>
        <Heading mb={2}>我的票券</Heading>
        <Flex justifyContent="center" margin="0 auto 16px" width="66%">
          <CircularProgress
            capIsRound
            isIndeterminate
            color="green.300"
            size="120px"
          />
        </Flex>
      </>
    );
  } else if (!balanceOfData) {
    return (
      <>
        <Heading mb={2}>我的票券</Heading>
        <Flex justifyContent="center" margin="0 auto 16px" width="66%">
          <Text fontSize="xl" mb={2} width="100%">
            尚未擁有任何票券 😢
          </Text>
        </Flex>
      </>
    );
  } else if (error) {
    // We should probably come up with something better to render
    <>
      <Heading mb={2}>我的票券</Heading>
      <Flex justifyContent="center" margin="0 auto 16px" width="66%">
        <Text fontSize="xl" mb={2} width="100%">
          尚未擁有任何票券 😢
        </Text>
      </Flex>
    </>;
  } else if (NFT) {
    return (
      <>
        <Heading mb={2}>我的票券</Heading>
        <Flex justifyContent="center" margin="0 auto 16px" width="66%">
          <Link
            href={NFT?.data?.image}
            isExternal
            width="100%"
            margin="16px 8px"
          >
            <Text fontSize="xl" textAlign="center" mb={2}>
              票券名稱：{NFT?.data?.name}
            </Text>
            <Box padding="12px" border="1px solid black" borderRadius="12px">
              <Image src={NFT?.data?.image} alt={NFT?.data?.name} />
            </Box>
          </Link>
        </Flex>
      </>
    );
  }

  // const createTicketDisplay = (ticket: any) => {
  //   // const pinataURI = "https://gateway.pinata.cloud/ipfs/";
  //   // console.log("ticket.contract.address", ticket.contract.address);
  //   // console.log("process.env.REACT_APP_CONTRACT_ID", process.env.REACT_APP_CONTRACT_ID)
  //   // console.log(ticket.contract.address.toString() !== process.env.REACT_APP_CONTRACT_ID);
  //   return (
  //     <Link
  //       href={ticket.metadata.image}
  //       key={ticket.id.tokenId}
  //       isExternal
  //       width="100%"
  //       margin="16px 8px"
  //     >
  //       <Text fontSize="xl" textAlign="center" mb={2}>
  //         票券名稱：{ticket.metadata.name}
  //       </Text>
  //       <Box padding="12px" border="1px solid black" borderRadius="12px">
  //         <Image src={ticket.metadata.image} alt={ticket.metadata.name} />
  //       </Box>
  //     </Link>
  //   );
  // };

  // // Alchemy URL
  // const baseURL = `https://polygon-mumbai.g.alchemy.com/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/getNFTs`;
  // const url = `${baseURL}?contractAddress=${process.env.NEXT_PUBLIC_CONTRACT_ID}&owner=${address}`;
  // const config = {
  //   method: "get",
  //   url: url,
  // };

  // useEffect(() => {
  //   if (!address) return;
  //   axios(config)
  //     .then((res: any) => {
  //       setLoadingTicket(true);
  //       console.log("res", res);
  //       if (
  //         res.status === 200 &&
  //         res?.data?.ownedNfts &&
  //         res?.data?.ownedNfts.length
  //       ) {
  //         setTicket(res.data.ownedNfts);
  //       }
  //       setLoadingTicket(false);
  //     })
  //     .catch((err: Error) => {
  //       console.log(err);
  //       setLoadingTicket(false);
  //     });
  // }, [address]);

  // /**
  //  * Filter the ticket which contract address is the same as the contract address in .env
  //  */
  // let validTickets = [];
  // if (!loadingTicket && ticket) {
  //   validTickets = ticket.filter(
  //     (t) =>
  //       t.contract.address.toLowerCase() ===
  //       process.env.NEXT_PUBLIC_CONTRACT_ID?.toLowerCase()
  //   );
  // }
  // console.log(validTickets);
  // return (
  //   <>
  //     <Heading mb={2}>我的票券</Heading>
  //     <Flex justifyContent="center" margin="0 auto 16px" width="66%">
  //       {loadingTicket && (
  //         <CircularProgress
  //           capIsRound
  //           isIndeterminate
  //           color="green.300"
  //           size="120px"
  //         />
  //       )}
  //       {!loadingTicket &&
  //         validTickets.length > 0 &&
  //         validTickets.map(createTicketDisplay)}
  //       {!loadingTicket && validTickets.length === 0 && (
  //         <Text fontSize="xl" mb={2} width="100%">
  //           尚未擁有任何票券 😢
  //         </Text>
  //       )}
  //     </Flex>
  //   </>
  // );
}

export default Wallet;
