import {
  Flex,
  Text,
  VStack,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AccordionProps,
  AccordionItemProps,
  forwardRef,
  StackProps,
  Divider,
  BoxProps,
  Box,
  FlexProps,
} from "@chakra-ui/react"
import {
  OnDragEndResponder,
  Droppable,
  DragDropContext,
  Draggable,
} from "@hello-pangea/dnd"
import { IconButton } from "@opengovsg/design-system-react"
import { PropsWithChildren } from "react"
import { v4 as uuid } from "uuid"

import { BxDraggable } from "assets"

interface SidebarHeaderProps {
  title: string
}
const SidebarHeader = ({ title }: SidebarHeaderProps) => {
  return (
    <Flex
      w="100%"
      bg="base.canvas.default"
      pos="sticky"
      justify="center"
      py="1rem"
    >
      <Text textStyle="subhead-3" color="base.content.brand">
        {title}
      </Text>
    </Flex>
  )
}

// TODO: Need to place this on top of draggable section
export const CustomiseSectionsHeader = () => (
  <>
    <Text textStyle="h5">Customise Sections</Text>
    <Text textStyle="body-2">Drag and drop sections to rearrange them</Text>
  </>
)

interface EmptySectionProps {
  image?: JSX.Element
  title: string
  subtitle: string
  isEmpty?: boolean
}
export const EmptySection = ({
  image,
  children,
  title,
  subtitle,
  isEmpty,
}: PropsWithChildren<EmptySectionProps>) => {
  return isEmpty ? (
    <Flex
      alignItems="center"
      flexDir="column"
      p="3.75rem 1.5rem"
      justifyContent="center"
    >
      {image}
      <Text>{title}</Text>
      <Text
        textStyle="caption-2"
        textColor="base.content.medium"
        textAlign="center"
      >
        {subtitle}
      </Text>
    </Flex>
  ) : (
    <>{children}</>
  )
}

export type EditableSidebarProps = SidebarHeaderProps & FlexProps
const EditableSidebar = ({
  title,
  children,
  ...rest
}: EditableSidebarProps) => {
  return (
    <Flex
      flexDir="column"
      bg="base.canvas.alt"
      width="450px"
      overflowY="scroll"
      pb="100px"
      // NOTE: We reserve 80px **each** for
      // both the header and the footer
      h="calc(100vh - 160px - 1rem)"
      {...rest}
    >
      <SidebarHeader title={title} />
      {children}
    </Flex>
  )
}

type HomepageDroppableZone = "dropdownelem" | "leftPane" | "highlight"

type DropInfo = {
  droppableId: HomepageDroppableZone
  type: string
}

const getDroppableInfo = (editableId: HomepageDroppableZone): DropInfo => {
  if (editableId === "leftPane")
    return { droppableId: editableId, type: "editor" }
  return {
    droppableId: editableId,
    type: editableId,
  }
}

export interface EditableDraggableProps extends Omit<BoxProps, "onDragEnd"> {
  onDragEnd: OnDragEndResponder
  editableId: HomepageDroppableZone
}
/**
 * This component provides the drag and drop context required for its children to be draggable.
 * Do note that anything inside this component will be able to be dragged to.
 *
 * This means that children of this component **can interfere** with
 * the draggable styling even if they are not draggable themselves.
 * @param onDragEnd this should be a drag responder that determines the order
 * of draggables once the drag handle has been released.
 * @param editableId this determines the zone that the child draggables will be in.
 */
export const EditableDroppable = ({
  onDragEnd,
  children,
  editableId,
  ...rest
}: PropsWithChildren<EditableDraggableProps>) => {
  return (
    // NOTE: According to the dnd docs,
    // there CANNOT be more than 1
    // `DragDropContext` in the component tree.
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable {...getDroppableInfo(editableId)}>
        {(droppableProvided) => (
          <Box
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
            {...rest}
          >
            {children}
            {droppableProvided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  )
}

const BaseAccordionItem = forwardRef((props: AccordionItemProps, ref) => {
  return (
    <AccordionItem
      border="1px solid"
      borderColor="base.divider.medium"
      w="100%"
      bg="base.canvas.default"
      ref={ref}
      {...props}
    />
  )
})

interface EditableCardProps {
  title: string
  isInvalid?: boolean
}
// TODO: Break this up into individual sub-components
// that can be selectively used to create the card
/**
 * This component displays an accordion item that can be expanded to show its children.
 * It is not draggable and should not be part of any `Droppable` component
 * to avoid style clashes during drag and drop.
 * @param isInvalid this prop determines whether the error border will be present on collapse.
 */
const EditableAccordionItem = ({
  title,
  children,
  isInvalid,
}: PropsWithChildren<EditableCardProps>) => {
  return (
    <BaseAccordionItem pos="relative">
      {({ isExpanded }) => (
        <>
          {!isExpanded && isInvalid && (
            <Divider
              border="4px solid"
              borderColor="utility.feedback.critical"
              orientation="vertical"
              left={0}
              position="absolute"
              h="-webkit-fill-available"
            />
          )}
          {/* NOTE: Check with design on styling. 
        See if entire section is button (ie, whole component hover styling)
      */}
          <AccordionButton px="1.5rem" py="3rem">
            <Flex flex="1" flexDir="column">
              <Text textStyle="h6" textAlign="left" mt="0.25rem" noOfLines={1}>
                {title}
              </Text>
            </Flex>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>{children}</AccordionPanel>
        </>
      )}
    </BaseAccordionItem>
  )
}

interface DraggableAccordionItemProps {
  tag?: JSX.Element
  title: string
  // TODO: Should get these props automatically
  // rather than having us pass in manually
  index: number
  draggableId: string
  isInvalid?: boolean
}
// NOTE: Separating editable/draggable
// due to semantics on `Draggables`
/**
 * This component displays an accordion item that can be expanded to show its children.
 * This component is draggable and **needs** to be part of a `Droppable` component.
 *
 * Take note that this component is draggable on the entire card when collapsed
 * and that only the chevron can be used to expand this component.
 * @param isInvalid this prop determines whether the error border will be present on collapse.
 */
const DraggableAccordionItem = ({
  tag,
  title,
  children,
  index,
  isInvalid,
}: PropsWithChildren<DraggableAccordionItemProps>) => {
  return (
    <Draggable draggableId={uuid()} index={index}>
      {(draggableProvided) => (
        <BaseAccordionItem
          borderRadius="0.5rem"
          {...draggableProvided.draggableProps}
          ref={draggableProvided.innerRef}
          boxShadow="sm"
          {...draggableProvided.dragHandleProps}
          position="relative"
        >
          {({ isExpanded }) => (
            <>
              <IconButton
                position="absolute"
                top="0.5rem"
                left="0"
                right="0"
                variant="clear"
                cursor="grab"
                aria-label="drag item"
                margin="0 auto"
                w="fit-content"
                icon={<BxDraggable />}
              />
              {!isExpanded && isInvalid && (
                <Divider
                  border="4px solid"
                  borderColor="utility.feedback.critical"
                  orientation="vertical"
                  left={0}
                  position="absolute"
                  borderLeftRadius="0.5rem"
                  h="-webkit-fill-available"
                />
              )}
              <Flex
                flexDir="row"
                pt="1.88rem"
                pb={isExpanded ? "0rem" : "0.88rem"}
                _hover={{
                  bgColor: isExpanded ? "none" : "interaction.muted.main.hover",
                }}
              >
                <Flex
                  pl="1.5rem"
                  pb={tag ? "1rem" : "1.37rem"}
                  pt={tag ? "0" : "0.37rem"}
                  flex="1"
                  flexDir="column"
                  // NOTE: Allocate 3.25rem for the accordion button
                  // so that the text doesn't cut into it
                  // and the button doesn't go out of the bounding box
                  maxW="calc(100% - 3.25rem)"
                >
                  {tag}
                  <Text
                    textStyle="h6"
                    textAlign="left"
                    mt="0.25rem"
                    noOfLines={1}
                    maxW="100%"
                  >
                    {title}
                  </Text>
                </Flex>
                <AccordionButton w="auto" h="fit-content" py="1rem" mr="0.5rem">
                  <AccordionIcon />
                </AccordionButton>
              </Flex>
              <AccordionPanel pb={4}>{children}</AccordionPanel>
            </>
          )}
        </BaseAccordionItem>
      )}
    </Draggable>
  )
}

const EditableAccordion = (props: AccordionProps) => {
  return <Accordion allowToggle bg="base.canvas.default" {...props} />
}

const EditableSection = (props: StackProps) => (
  <VStack px="0.5rem" align="flex-start" spacing="1rem" {...props} />
)

export const Editable = {
  Sidebar: EditableSidebar,
  Droppable: EditableDroppable,
  EditableAccordionItem,
  Accordion: EditableAccordion,
  DraggableAccordionItem,
  Section: EditableSection,
  EmptySection,
}
