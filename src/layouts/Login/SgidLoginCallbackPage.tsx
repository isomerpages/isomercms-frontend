import {
  Flex,
  Text,
  Icon,
  VStack,
  Spinner,
  Box,
  Divider,
} from "@chakra-ui/react"
import { Link } from "@opengovsg/design-system-react"
import { useEffect } from "react"
import { BiChevronRight } from "react-icons/bi"
import { useLocation } from "react-router-dom"

import { useSgidLogin, useSgidMultiuserLogin } from "hooks/loginHooks"

import { IsomerLogo } from "assets"

export const SgidLoginCallbackPage = (): JSX.Element => {
  const { search } = useLocation()
  const urlSearchParams = new URLSearchParams(search)
  const params = Object.fromEntries(urlSearchParams.entries())
  const { code } = params

  const { data: employments } = useSgidLogin({ code })

  const { mutateAsync: onSelectLogin } = useSgidMultiuserLogin()

  useEffect(() => {
    if (!employments) return
    if (employments.length === 1) {
      window.location.replace("/sites")
    }
  }, [employments])

  const shouldDisplayUserSelect = employments && employments.length > 1

  const UserSelect = (): JSX.Element => {
    return (
      <Flex
        flexDir="column"
        w="24.5rem"
        p="2rem"
        maxW="100%"
        background="base.canvas.default"
        overflow="scroll"
        maxH="90%"
      >
        <Box h="1.5rem">
          <IsomerLogo />
        </Box>

        <Text my="2rem" textStyle="h4" textColor="base.content.strong">
          Choose an account to continue to IsomerCMS
        </Text>
        <Divider />
        {shouldDisplayUserSelect &&
          employments.map((employment) => (
            <Box>
              <Flex
                px="1rem"
                py="1.5rem"
                borderRadius="lg"
                cursor="pointer"
                alignItems="center"
                onClick={() => onSelectLogin({ email: employment.email })}
                _hover={{ bg: "primary.50" }}
                _active={{ bg: "primary.100" }}
              >
                <Flex flexDir="column" gap="0.25rem">
                  <Text textStyle="subhead-2" textColor="base.content.strong">
                    {employment.email}
                  </Text>
                  {employment.agencyName && (
                    <Text textStyle="caption-2" textColor="base.content.medium">
                      {`${employment.agencyName}${
                        employment.departmentName
                          ? `, ${employment.departmentName}`
                          : ""
                      }`}
                    </Text>
                  )}
                  {employment.employmentTitle && (
                    <Text textStyle="caption-2" textColor="base.content.medium">
                      {employment.employmentTitle}
                    </Text>
                  )}
                </Flex>
                <Icon as={BiChevronRight} boxSize="1.5rem" ml="auto" />
              </Flex>
              <Divider />
            </Box>
          ))}
        <Text mt="2rem" fontSize="0.75rem">
          <Link
            href="/"
            color="interaction.links.neutral-default"
            _hover={{
              color: "interaction.links.neutral-default",
              textDecoration: "underline",
            }}
          >
            Or, log in manually using email and OTP
          </Link>
        </Text>
      </Flex>
    )
  }

  return (
    <Flex w="full" h="100vh" alignItems="center" justifyContent="center">
      {shouldDisplayUserSelect ? (
        <UserSelect />
      ) : (
        <VStack gap="1.25rem">
          <Spinner
            size="xl"
            thickness="4px"
            color="base.content.strong"
            margin="auto"
          />
          <Text textStyle="subhead-1">Redirecting you to IsomerCMS...</Text>
        </VStack>
      )}
    </Flex>
  )
}
