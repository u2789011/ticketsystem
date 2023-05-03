import { Box, Container, Flex, VStack } from "@chakra-ui/react";

function Page({ children }) {
  return (
    <Flex
      align="center"
      bg="linear-gradient(
    180deg,
    rgba(162, 98, 210, 1) 0%,
    rgba(110, 99, 201, 1) 35%,
    rgba(16, 101, 184, 1) 100%
  )"
      bgSize="cover"
      bgRepeat="no-repeat"
      bgPosition="right top"
      direction="column"
      grow="1"
      minH="100vh"
      justify="center"
      position="relative"
      padding="0 12px"
    >
      <Container
        maxW="container.sm"
        centerContent={true}
        border="1px solid black"
        bg="white"
        borderRadius="24px"
        minH="66vh"
        margin="12px 12px"
        position="relative"
      >
        <VStack w="100%" flex="1 1 auto">
          <VStack width="100%" padding="24px 12px">
            <Box margin="0 0 16px 0" padding="0 16px" width="100%">
              {children}
            </Box>
          </VStack>
        </VStack>
      </Container>
    </Flex>
  );
}

export default Page;
