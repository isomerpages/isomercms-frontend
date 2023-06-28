import {
  Box,
  Center,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tr,
  Text,
  TextProps,
  Skeleton,
} from "@chakra-ui/react"
import { Button, Checkbox, Link } from "@opengovsg/design-system-react"
import { useForm } from "react-hook-form"

import { useSiteLaunchContext } from "contexts/SiteLaunchContext"

import { BxCopy, BxLifeBuoy } from "assets"
import {
  DNSRecord,
  SITE_LAUNCH_PAGES,
  SITE_LAUNCH_TASKS,
  SITE_LAUNCH_TASKS_LENGTH,
} from "types/siteLaunch"

import { SiteLaunchPadBody } from "./SiteLaunchPadBody"
import { SiteLaunchPadTitle } from "./SiteLaunchPadTitle"

const TITLE_TEXTS = [
  "Set your DNS Time To Live(TTL) to 5 mins at least 24 hours before launching",
  "Approve and publish your first review request",
  "Drop existing domains on Cloudfront",
  "Delete existing DNS records from your nameserver",
  "Wait 1 hour to flush existing records",
]

export const SiteLaunchChecklistTitle = (): JSX.Element => {
  const title = "Complete these tasks to launch"
  const subTitle =
    "The following list has been generated based on information provided on your domain"
  return <SiteLaunchPadTitle title={title} subTitle={subTitle} />
}

const getTextProps = (index: number, tasksDone: number): TextProps => {
  const disabled = tasksDone >= index + 1 || tasksDone < index - 1
  if (disabled) {
    return {
      color: "interaction.support.disabled",
    }
  }
  return { as: "b" }
}

const textWithCopyIcon = (text: string): JSX.Element => {
  return (
    <Button variant="link" onClick={() => navigator.clipboard.writeText(text)}>
      <Box display="flex" alignItems="center" maxW="16rem">
        <Text
          textStyle="body-2"
          color="black"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {text}
        </Text>
        <Icon as={BxCopy} ml="0.5rem" />
      </Box>
    </Button>
  )
}

const generateDNSTable = (dnsRecords: DNSRecord[] | undefined): JSX.Element => {
  return (
    <TableContainer width="100%">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Td textStyle="subhead-2" bg="gray.100">
              <Text>Source</Text>
            </Td>
            <Td textStyle="subhead-2" bg="gray.100">
              <Text>Type</Text>
            </Td>
            <Td textStyle="subhead-2" bg="gray.100">
              <Text>Target</Text>
            </Td>
          </Tr>
        </Thead>
        <Tbody>
          {dnsRecords?.map((record) => (
            <Tr>
              <Td textStyle="body-2" color="text.label.secondary">
                {textWithCopyIcon(record.source)}
              </Td>
              <Td textStyle="body-2" color="text.label.secondary">
                <Text>{record.type}</Text>
              </Td>
              <Td textStyle="body-2" color="text.label.secondary">
                {textWithCopyIcon(record.target)}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

interface SiteLaunchChecklistBodyProps {
  setPageNumber: (number: number) => void
  handleIncrementStepNumber: () => void
  handleDecrementStepNumber: () => void
}

interface TableMappingProps {
  title: JSX.Element
  subTitle?: JSX.Element
  checkbox: JSX.Element
}

const addSubtitlesForChecklist = (
  TABLE_MAPPING: TableMappingProps[],
  tasksDone: number
): TableMappingProps[] => {
  const newTableMapping = [...TABLE_MAPPING]
  newTableMapping[SITE_LAUNCH_TASKS.SET_DNS_TTL - 1].subTitle = (
    <>
      {tasksDone === SITE_LAUNCH_TASKS.SET_DNS_TTL - 1 && (
        <Text fontSize="small">
          You can check you current DNS TTL through 3rd party applications such
          as <Link href="https://www.nslookup.io/">nslookup.io</Link>
        </Text>
      )}
    </>
  )
  newTableMapping[SITE_LAUNCH_TASKS.DROP_CLOUDFRONT - 1].subTitle = (
    <>
      {tasksDone === SITE_LAUNCH_TASKS.DROP_CLOUDFRONT - 1 && (
        <Text fontSize="small">
          If you are using CWP, please contact them to do this for you
        </Text>
      )}
    </>
  )
  newTableMapping[
    SITE_LAUNCH_TASKS.DELETE_EXISTING_DNS_RECORDS - 1
  ].subTitle = (
    <>
      {tasksDone === SITE_LAUNCH_TASKS.DELETE_EXISTING_DNS_RECORDS - 1 && (
        <Text fontSize="small">
          This should be done as soon as domains are dropped
        </Text>
      )}
    </>
  )
  return newTableMapping
}

export const SiteLaunchChecklistBody = ({
  setPageNumber,
  handleIncrementStepNumber,
  handleDecrementStepNumber,
}: SiteLaunchChecklistBodyProps): JSX.Element => {
  const {
    siteLaunchStatusProps,
    setSiteLaunchStatusProps,
  } = useSiteLaunchContext()

  // todo remove this mock after IS-219
  const mockDNSRecords = () => {
    if (siteLaunchStatusProps) {
      setTimeout(() => {
        setSiteLaunchStatusProps({
          stepNumber: SITE_LAUNCH_TASKS_LENGTH,
          siteLaunchStatus: "LAUNCHING",
          dnsRecords: [
            {
              source: "www.isomer.gov.sg",
              type: "CNAME",
              target: "dodsfdsag34fd2.cloudfront.net",
            },
            {
              source: "isomer.gov.sg",
              type: "A",
              target: "18.1.2.3",
            },
            {
              source: "_ba2bfdc9cd3388ff4427040b865afacf5.isomer.gov.sg",
              type: "CNAME",
              target:
                "_617497b1eed3650c89eb59582d89d085.xmjnffzjyj.acm-validations.aws",
            },
          ],
        })
      }, 10000)
    }
  }

  const numberOfTasks = SITE_LAUNCH_TASKS_LENGTH
  const numberOfCheckboxes = numberOfTasks - 1 // last task is a button
  const { register, watch, setValue } = useForm({
    defaultValues: {
      checkboxes: Array.from(
        { length: numberOfCheckboxes },
        (_, i) =>
          i <
          (siteLaunchStatusProps?.stepNumber ?? SITE_LAUNCH_TASKS.NOT_STARTED)
      ),
    },
  })
  const tasksDone = watch("checkboxes").filter((checked) => checked).length

  const handleGenerateDNSRecordsOnClick = () => {
    setSiteLaunchStatusProps({
      ...siteLaunchStatusProps,
      stepNumber: SITE_LAUNCH_TASKS.GENERATE_NEW_DNS_RECORDS,
      siteLaunchStatus: "LAUNCHING",
    })

    /**
     * Although this is not a task, we want to disable the previous checkbox
     * and go back one the flow since this step is not reversible
     */
    setValue(`checkboxes.${SITE_LAUNCH_TASKS.GENERATE_NEW_DNS_RECORDS}`, true)
    // todo: actually generate DNS records
    mockDNSRecords()
  }

  const handleCheckboxChange = (checked: boolean, index: number) => {
    if (checked) {
      setValue(`checkboxes.${index}`, true)
      handleIncrementStepNumber()
    } else {
      setValue(`checkboxes.${index}`, false)
      handleDecrementStepNumber()
    }
  }

  const checkboxes = Array.from({ length: numberOfCheckboxes }, (_, i) => (
    <Center key={i}>
      <Checkbox
        {...register(`checkboxes.${i}`)}
        // we want use to check box in order, so we disable it when it is not the next one
        isDisabled={tasksDone >= i + 2 || tasksDone < i}
        isChecked={i < tasksDone}
        onChange={(e) => {
          handleCheckboxChange(e.target.checked, i)
        }}
      />
    </Center>
  ))

  let TABLE_MAPPING: TableMappingProps[] = Array.from(
    { length: numberOfCheckboxes },
    (_, i) => ({
      title: (
        <Text fontSize="s" {...getTextProps(i + 1, tasksDone)} key={i}>
          {TITLE_TEXTS[i]}
        </Text>
      ),
      checkbox: checkboxes[i],
    })
  )

  // Add all subtitle for some of the tasks
  TABLE_MAPPING = addSubtitlesForChecklist(TABLE_MAPPING, tasksDone)

  return (
    <SiteLaunchPadBody>
      <Text mb="2rem">
        <Text as="b">Tasks must be done in this order. </Text>
        Mark the task as done to enable the next task item. Once all items are
        marked done, you can proceed to the next page to track your site launch
        status.
      </Text>
      <Text mb="2rem">
        You may leave this page and return later to continue from where you left
        off. If you run into issues, contact the Isomer team using the I need
        support button.
      </Text>
      <Box
        border="1px solid"
        borderColor="base.divider.medium"
        borderRadius="md"
        mb="2rem"
      >
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Td bg="gray.100">
                  <Text>
                    Site launch tasks ({tasksDone}/{numberOfTasks})
                  </Text>
                </Td>
                <Td bg="gray.100" textAlign="center">
                  <a href="mailto:support@isomer.gov.sg">
                    I need support <Icon as={BxLifeBuoy} />
                  </a>
                </Td>
              </Tr>
            </Thead>
            <Tbody>
              {TABLE_MAPPING.map(({ title, subTitle, checkbox }) => (
                <Tr>
                  <Td>
                    {title}
                    {subTitle}
                  </Td>
                  {/* Setting the width here to 20 percent so that the column doesn't
                    shift noticeably when the checkbox is clicked */}
                  <Td width="20%">
                    <Center>{checkbox}</Center>
                  </Td>
                </Tr>
              ))}

              <Tr>
                <Td>
                  <Text
                    fontSize="s"
                    {...getTextProps(
                      SITE_LAUNCH_TASKS.GENERATE_NEW_DNS_RECORDS,
                      tasksDone
                    )}
                  >
                    Upload new DNS records to IT Service Management
                  </Text>
                  {tasksDone ===
                    SITE_LAUNCH_TASKS.GENERATE_NEW_DNS_RECORDS - 1 && (
                    <Text fontSize="small">This can only be done once</Text>
                  )}
                </Td>
                <Td>
                  <Button
                    disabled={
                      tasksDone !==
                      SITE_LAUNCH_TASKS.GENERATE_NEW_DNS_RECORDS - 1
                    }
                    variant="outline"
                    onClick={handleGenerateDNSRecordsOnClick}
                  >
                    Generate DNS records
                  </Button>
                </Td>
              </Tr>
              {siteLaunchStatusProps?.siteLaunchStatus === "LAUNCHING" && (
                <Tr borderTopStyle="hidden">
                  <Td colSpan={2} mb="2rem">
                    {!siteLaunchStatusProps?.dnsRecords && (
                      <>
                        <Text>
                          Generating your DNS records will take 2 minutes.
                        </Text>
                        <Text>
                          Do not leave or refresh this page in the meantime.
                        </Text>
                      </>
                    )}
                    <Skeleton isLoaded={!!siteLaunchStatusProps?.dnsRecords}>
                      {siteLaunchStatusProps?.siteLaunchStatus ===
                        "LAUNCHING" &&
                        generateDNSTable(siteLaunchStatusProps.dnsRecords)}
                    </Skeleton>
                  </Td>
                </Tr>
              )}
              {!!siteLaunchStatusProps?.dnsRecords && (
                <Tr borderTopStyle="hidden">
                  <Td colSpan={2}>
                    <Center>
                      <Text>
                        If the above steps are done correctly, after updating
                        your DNS settings, the site should be up within 1 hour.
                      </Text>
                    </Center>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="link"
          ml="auto"
          onClick={() => setPageNumber(SITE_LAUNCH_PAGES.DISCLAIMER)}
        >
          Back
        </Button>
      </Box>
    </SiteLaunchPadBody>
  )
}
