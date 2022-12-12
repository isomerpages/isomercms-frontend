import { Box, Flex, Spacer, VStack, Text, Heading } from "@chakra-ui/react"
import { Button, Link } from "@opengovsg/design-system-react"
import { useEffect } from "react"
import ReactDiffViewer, {
  DiffMethod,
  ReactDiffViewerProps,
} from "react-diff-viewer"
import { BiLeftArrowAlt } from "react-icons/bi"
import { useParams } from "react-router-dom"

import { useBlob } from "hooks/githubHooks/useBlob"

import { getAxiosErrorMessage } from "utils/axios"

import { useErrorToast } from "utils"

export const DiffViewer = ({
  oldValue,
  newValue,
  ...props
}: ReactDiffViewerProps): JSX.Element => {
  return (
    <ReactDiffViewer
      oldValue={oldValue}
      newValue={newValue}
      splitView
      // NOTE: Using words and not chars because chars will
      // make it look as though there's an extra space inserted
      // in (see: `b` vs `boo`)
      compareMethod={DiffMethod.WORDS}
      styles={{
        content: {
          width: "45%",
        },
        diffContainer: {
          width: "100%",
          tableLayout: "fixed",
        },
        codeFoldGutter: {
          width: "3.125rem",
        },
        marker: {
          width: "2rem",
        },
      }}
      {...props}
    />
  )
}

// TODO
const generateStagingLink = (fileName: string, path: string[]): string =>
  "https://www.google.com"

const StatusBar = ({ fileName, onClick, path }: DiffViewProps): JSX.Element => {
  return (
    <Flex dir="row" w="100%" alignItems="center">
      <Button
        variant="clear"
        leftIcon={<BiLeftArrowAlt fontSize="1.5rem" />}
        onClick={onClick}
      >
        Back to review request
      </Button>
      <Spacer />
      <Box>
        <Link
          isExternal
          href={generateStagingLink(fileName, path)}
          textDecorationLine="none"
          textStyle="subhead-1"
        >
          Open page in staging
        </Link>
      </Box>
    </Flex>
  )
}

export interface DiffViewProps {
  fileName: string
  path: string[]
  onClick: () => void
}

export const DiffView = ({
  fileName,
  path,
  onClick,
}: DiffViewProps): JSX.Element => {
  const { reviewId, siteName } = useParams<{
    reviewId: string
    siteName: string
  }>()
  const prNumber = parseInt(reviewId, 10)
  const errorToast = useErrorToast()
  const { data, error, isError } = useBlob(
    siteName,
    `${path.join("/")}/${fileName}`,
    prNumber
  )

  useEffect(() => {
    if (isError) {
      errorToast({ description: getAxiosErrorMessage(error) })
    }
  }, [error, errorToast, isError])

  return (
    <VStack spacing="1.5rem" align="flex-start" mt="1.5rem">
      <VStack spacing="0.625rem" align="flex-start" w="100%">
        <Heading
          as="h2"
          textStyle="h2"
        >{`Compare changes for '${fileName}'`}</Heading>
        <Text textColor="text.link.default" textStyle="body-2">
          Review proposed changes on the right
        </Text>
      </VStack>
      <StatusBar fileName={fileName} onClick={onClick} path={path} />
      <Box
        border="1px solid"
        borderColor="border.input.default"
        w="full"
        borderRadius="0.25rem"
      >
        <Flex
          align="center"
          justify="center"
          py="0.875rem"
          px="2rem"
          borderBottom="1px solid"
          borderBottomColor="border.input.default"
        >
          <Text textStyle="caption-2" noOfLines={1}>
            {fileName}
          </Text>
        </Flex>
        <DiffViewer
          oldValue={data?.oldValue || ""}
          newValue={data?.newValue || ""}
        />
      </Box>
    </VStack>
  )
}
