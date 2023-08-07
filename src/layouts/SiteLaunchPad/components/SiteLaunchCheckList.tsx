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
import { useParams, Link as RouterLink } from "react-router-dom"

import { useSiteLaunchContext } from "contexts/SiteLaunchContext"

import { BxCopy, BxLifeBuoy } from "assets"
import {
  DNSRecord,
  getNewDomainTaskFrmIdx,
  getOldDomainTaskFrmIdx,
  NEW_DOMAIN_SITE_LAUNCH_TASKS_LENGTH,
  SITE_LAUNCH_TASKS,
  SITE_LAUNCH_TASKS_LENGTH,
  TITLE_TEXTS_NEW_DOMAIN,
  TITLE_TEXTS_OLD_DOMAIN,
} from "types/siteLaunch"

import { SiteLaunchPadBody } from "./SiteLaunchPadBody"
import { SiteLaunchPadTitle } from "./SiteLaunchPadTitle"

export const SiteLaunchChecklistTitle = (): JSX.Element => {
  const title = "Complete these tasks to launch"
  const subTitle =
    "The following list has been generated based on information provided on your domain"
  return <SiteLaunchPadTitle title={title} subTitle={subTitle} />
}

const getTextProps = (index: number, tasksDone: number): TextProps => {
  const tasksPending = tasksDone < index
  if (tasksPending) {
    return {
      color: "interaction.support.disabled-content",
    }
  }
  const taskDone = tasksDone >= index

  if (taskDone) {
    return {
      color: "base.content.default",
    }
  }

  return {
    color: "base.content.strong",
    as: "b",
  }
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
  handleIncrementStepNumber: () => void
  handleDecrementStepNumber: () => void
}

interface TableMappingProps {
  stepNumber: number
  title: JSX.Element
  subTitle?: JSX.Element
  checkbox: JSX.Element
}

const addSubtitlesForChecklist = (
  task: TableMappingProps,
  tasksDone: number
): TableMappingProps => {
  const newTask = { ...task }
  if (task.stepNumber === SITE_LAUNCH_TASKS.SET_DNS_TTL - 1) {
    newTask.subTitle = (
      <>
        {tasksDone === SITE_LAUNCH_TASKS.SET_DNS_TTL - 1 && (
          <Text fontSize="small" textColor="base.content.medium">
            You can check your current DNS TTL through 3rd party applications
            such as{" "}
            <Link href="https://www.nslookup.io/" isExternal>
              nslookup.io
            </Link>
          </Text>
        )}
      </>
    )
    return newTask
  }
  if (task.stepNumber === SITE_LAUNCH_TASKS.DROP_CLOUDFRONT - 1) {
    newTask.subTitle = (
      <>
        {tasksDone === SITE_LAUNCH_TASKS.DROP_CLOUDFRONT - 1 && (
          <Text fontSize="small" textColor="base.content.medium">
            If you are using CWP, please contact them to do this for you
          </Text>
        )}
      </>
    )
    return newTask
  }
  if (task.stepNumber === SITE_LAUNCH_TASKS.DELETE_EXISTING_DNS_RECORDS - 1) {
    newTask.subTitle = (
      <>
        {tasksDone === SITE_LAUNCH_TASKS.DELETE_EXISTING_DNS_RECORDS - 1 && (
          <Text fontSize="small" textColor="base.content.medium">
            This should be done as soon as domains are dropped
          </Text>
        )}
      </>
    )
    return newTask
  }
  return newTask
}

export const SiteLaunchChecklistBody = ({
  handleIncrementStepNumber,
  handleDecrementStepNumber,
}: SiteLaunchChecklistBodyProps): JSX.Element => {
  const {
    siteLaunchStatusProps,
    setSiteLaunchStatusProps,
    generateDNSRecords,
  } = useSiteLaunchContext()

  const { siteName } = useParams<{ siteName: string }>()

  const numberOfTasks = siteLaunchStatusProps?.isNewDomain
    ? NEW_DOMAIN_SITE_LAUNCH_TASKS_LENGTH
    : SITE_LAUNCH_TASKS_LENGTH

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
    generateDNSRecords()
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
        isDisabled={
          tasksDone >= i + 2 ||
          tasksDone < i ||
          siteLaunchStatusProps?.siteLaunchStatus === "LAUNCHING"
        }
        isChecked={
          i < tasksDone ||
          siteLaunchStatusProps?.siteLaunchStatus === "LAUNCHING"
        }
        onChange={(e) => {
          handleCheckboxChange(e.target.checked, i)
        }}
      />
    </Center>
  ))

  let tableMapping: TableMappingProps[] = Array.from(
    { length: numberOfCheckboxes },
    (_, i) => ({
      stepNumber: i,
      title: (
        <Text
          fontSize="s"
          key={i}
          textStyle="subhead-2"
          textColor="base.content.strong"
          {...getTextProps(i, tasksDone)}
        >
          {siteLaunchStatusProps?.isNewDomain
            ? TITLE_TEXTS_NEW_DOMAIN[getNewDomainTaskFrmIdx()]
            : TITLE_TEXTS_OLD_DOMAIN[getOldDomainTaskFrmIdx(i)]}
        </Text>
      ),
      checkbox: checkboxes[i],
    })
  )

  // Add all subtitle for some of the tasks
  if (!siteLaunchStatusProps?.isNewDomain) {
    tableMapping = tableMapping.map((task) => {
      return addSubtitlesForChecklist(task, tasksDone)
    })
  }

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
                <Td bg="gray.100" width="70%">
                  <Text textStyle="subhead-2">
                    Site launch tasks ({tasksDone}/{numberOfTasks})
                  </Text>
                </Td>
                <Td bg="gray.100" textAlign="center" width="30%">
                  <a href="mailto:support@isomer.gov.sg">
                    I need support <Icon as={BxLifeBuoy} />
                  </a>
                </Td>
              </Tr>
            </Thead>
            <Tbody>
              {tableMapping.map(({ stepNumber, title, subTitle, checkbox }) => (
                <Tr key={stepNumber}>
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
                    textStyle="subhead-2"
                    textColor="base.content.dark"
                    {...getTextProps(
                      siteLaunchStatusProps?.isNewDomain
                        ? NEW_DOMAIN_SITE_LAUNCH_TASKS_LENGTH - 1
                        : SITE_LAUNCH_TASKS_LENGTH - 1,
                      tasksDone
                    )}
                  >
                    Upload new DNS records to IT Service Management
                  </Text>
                  {tasksDone === numberOfTasks - 1 && (
                    <Text fontSize="small">This can only be done once</Text>
                  )}
                </Td>
                <Td>
                  <Center>
                    <Button
                      isDisabled={tasksDone !== numberOfTasks - 1}
                      variant="outline"
                      onClick={handleGenerateDNSRecordsOnClick}
                    >
                      <Text textStyle="subhead-2">Generate DNS records</Text>
                    </Button>
                  </Center>
                </Td>
              </Tr>
              {siteLaunchStatusProps?.siteLaunchStatus === "LAUNCHING" && (
                <Tr borderTopStyle="hidden">
                  <Td colSpan={2} mb="2rem">
                    {!siteLaunchStatusProps?.dnsRecords && (
                      <>
                        <Text>
                          Generating your DNS records will take around 2
                          minutes.
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

      <Box display="flex" justifyContent="flex-end" mb="2rem">
        <Link as={RouterLink} to={`/sites/${siteName}/dashboard`}>
          <Button variant="link" ml="auto">
            Back
          </Button>
        </Link>
      </Box>
    </SiteLaunchPadBody>
  )
}
