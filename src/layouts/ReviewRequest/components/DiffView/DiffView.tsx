import {
  Box,
  Flex,
  Spacer,
  VStack,
  Text,
  HStack,
  Heading,
  useToken,
  useTheme,
} from "@chakra-ui/react"
import { Button, IconButton, Link } from "@opengovsg/design-system-react"
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer"
import { BiLeftArrowAlt } from "react-icons/bi"

const oldCode = `
const a = 10
const b = 10
const c = () => console.log('foo')

if(a > 10) {
  console.log('bar')
}

console.log('done')
`
const newCode = `
const a = 10
const boo = 10

if(a === 10) {
  console.log('bar')
}
`

const generateStagingLink = (fileName: string): string =>
  "https://www.google.com"

const StatusBar = ({
  fileName,
}: Pick<DiffViewProps, "fileName">): JSX.Element => {
  return (
    <Flex dir="row" w="100%" alignItems="center">
      <Button variant="clear" leftIcon={<BiLeftArrowAlt fontSize="1.5rem" />}>
        Back to review request
      </Button>
      <Spacer />
      <Box>
        <Link
          isExternal
          href={generateStagingLink(fileName)}
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
}

export const DiffView = ({ fileName, path }: DiffViewProps): JSX.Element => {
  return (
    <VStack spacing="1.5rem" align="flex-start">
      <VStack spacing="0.625rem" align="flex-start" w="100%">
        <Heading
          as="h2"
          textStyle="h2"
        >{`Compare changes for '${fileName}'`}</Heading>
        <Text textColor="text.link.default" textStyle="body-2">
          Review proposed changes on the right
        </Text>
      </VStack>
      <StatusBar fileName={fileName} />
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
        <ReactDiffViewer
          oldValue={oldCode}
          newValue={newCode}
          splitView
          // NOTE: Using words and not chars because chars will
          // make it look as though there's an extra space inserted
          // in (see: `b` vs `boo`)
          compareMethod={DiffMethod.WORDS}
        />
      </Box>
    </VStack>
  )
}
