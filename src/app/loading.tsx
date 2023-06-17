"use client";

import React from "react";
import { CircularProgress, Flex } from "@chakra-ui/react";

function Loading() {
  return (
    <Flex justifyContent="center" width="100%" marginTop="20%">
      <CircularProgress
        capIsRound
        isIndeterminate
        color="green.300"
        size="120px"
      />
    </Flex>
  );
}

export default Loading;
