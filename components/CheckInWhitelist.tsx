import { useState } from "react";
import { Button, Flex, Text, Input } from "@chakra-ui/react";
import useCustomToast from "../components/hooks/useCustomToast";
import { nfTixBooth } from "../contracts/abis/nfTixBooth";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { useIsMounted } from "./../src/app/hooks/useIsMounted";
import { useDebounce } from "./../src/app/hooks/useDebounce";

const CheckInWhitelist = () => {
  const mounted = useIsMounted();
  const { showSuccessToastWithReactNode, showErrorToast } = useCustomToast();
  const [inputAddress, setInputAddress] = useState<string>("");
  const debouncedInputAddress = useDebounce(inputAddress, 500);

  // Get Input Address Value
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setInputAddress(event.target.value as `0x${string}`);

  // Check if address is in whitelist
  const { data: isCheckInWhiteList } = useContractRead({
    address: `${process.env.NEXT_PUBLIC_CONTRACT_ID}` as `0x${string}`,
    abi: nfTixBooth,
    functionName: "checkInWhitelist",
    args: [debouncedInputAddress],
    enabled: Boolean(debouncedInputAddress),
  });

  // Add address to whitelist
  const { config: addtoCheckInWhitelistConfig } = usePrepareContractWrite({
    address: `${process.env.NEXT_PUBLIC_CONTRACT_ID}` as `0x${string}`,
    abi: nfTixBooth,
    args: [debouncedInputAddress],
    enabled: Boolean(!isCheckInWhiteList),
    functionName: "addToCheckInWhitelist",
  });

  // Remove address from whitelist
  const { config: removeFromCheckInWhitelistConfig } = usePrepareContractWrite({
    address: `${process.env.NEXT_PUBLIC_CONTRACT_ID}` as `0x${string}`,
    abi: nfTixBooth,
    args: [debouncedInputAddress],
    enabled: Boolean(isCheckInWhiteList),
    functionName: "removeFromCheckInWhitelist",
  });

  const { write: addToCheckInWhitelist, isLoading: addWhitelistTxnPending } =
    useContractWrite({
      ...addtoCheckInWhitelistConfig,
      onSuccess(data, variables, context) {
        console.log("onSuccess", data, variables, context);
        showSuccessToastWithReactNode(
          "已新增地址為工作人員!",
          <a
            href={`https://mumbai.polygonscan.com/tx/${data.hash}`}
            target="_blank"
            rel="nofollow noreferrer"
          >
            在區塊鏈瀏覽器確認交易！
          </a>
        );
      },
      onError(error, variables, context) {
        console.log("onError", error, variables, context);
        showErrorToast(
          "Failure",
          error?.message ?? "Something went wrong, please try again later."
        );
      },
    });

  const {
    write: removeFromCheckInWhitelist,
    isLoading: removeWhitelistTxnPending,
  } = useContractWrite({
    ...removeFromCheckInWhitelistConfig,
    onSuccess(data, variables, context) {
      console.log("onSuccess", data, variables, context);
      showSuccessToastWithReactNode(
        "已刪除本工作人員地址!",
        <a
          href={`https://mumbai.polygonscan.com/tx/${data.hash}`}
          target="_blank"
          rel="nofollow noreferrer"
        >
          在區塊鏈瀏覽器確認交易！
        </a>
      );
    },
    onError(error, variables, context) {
      console.log("onError", error, variables, context);
      showErrorToast(
        "Failure",
        error?.message ?? "Something went wrong, please try again later."
      );
    },
  });

  return (
    <>
      <Text fontSize="xl" mb={8} mt={5}>
        操作智能合約新增或刪除工作人員地址：
      </Text>
      <Flex width="100%" justifyContent="center">
        <Input
          placeholder="工作人員錢包地址"
          mr={2}
          value={inputAddress}
          onChange={handleInputChange}
        />
        {isCheckInWhiteList ? (
          <Button
            isLoading={removeWhitelistTxnPending}
            colorScheme="red"
            onClick={mounted ? () => removeFromCheckInWhitelist?.() : undefined}
          >
            刪除
          </Button>
        ) : (
          <Button
            isLoading={addWhitelistTxnPending}
            colorScheme="teal"
            onClick={mounted ? () => addToCheckInWhitelist?.() : undefined}
          >
            新增
          </Button>
        )}
      </Flex>
    </>
  );
};

export default CheckInWhitelist;
