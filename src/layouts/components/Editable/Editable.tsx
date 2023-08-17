import {
  Center,
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
} from "@chakra-ui/react"
import {
  OnDragEndResponder,
  Droppable,
  DragDropContext,
  Draggable,
} from "@hello-pangea/dnd"
import { IconButton } from "@opengovsg/design-system-react"
import { PropsWithChildren } from "react"

import { BxDraggable, HomepageStartEditingImage } from "assets"

type SidebarHeaderProps = Pick<EditableSidebarProps, "title">
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
export const CustomiseSectionHeader = () => (
  <>
    <Text textStyle="h5">Customise Sections</Text>
    <Text textStyle="body-2">Drag and drop sections to rearrange them</Text>
  </>
)

const EmptySideBarBody = () => {
  return (
    <VStack spacing="0.5rem" alignItems="flex-start" px="1.5rem" pt="1.5rem">
      <CustomiseSectionHeader />
      <Flex
        alignItems="center"
        flexDir="column"
        p="3.75rem 1.5rem"
        justifyContent="center"
      >
        <HomepageStartEditingImage />
        <Text> Sections you add will appear here</Text>
        <Text
          textStyle="caption-2"
          textColor="base.content.medium"
          textAlign="center"
        >
          Add informative content to your website from images to text by
          clicking “Add section” below
        </Text>
      </Flex>
    </VStack>
  )
}

export interface EditableSidebarProps {
  title: string
}
const EditableSidebar = ({
  title,
  children,
}: PropsWithChildren<EditableSidebarProps>) => {
  return (
    <Flex flexDir="column" bg="base.canvas.alt">
      <SidebarHeader title={title} />
      {children ? <>{children}</> : <EmptySideBarBody />}
    </Flex>
  )
}

type HomepageDroppableZones = "dropdownelem" | "leftPane" | "highlight"

type DropInfo = {
  droppableId: HomepageDroppableZones
  type: string
}

const getDroppableInfo = (editableId: HomepageDroppableZones): DropInfo => {
  if (editableId === "leftPane")
    return { droppableId: editableId, type: "editor" }
  return {
    droppableId: editableId,
    type: editableId,
  }
}

export interface EditableDraggableProps {
  onDragEnd: OnDragEndResponder
  editableId: HomepageDroppableZones
}
const EditableDraggable = ({
  onDragEnd,
  children,
  editableId,
}: PropsWithChildren<EditableDraggableProps>) => {
  return (
    // NOTE: According to the dnd docs,
    // there CANNOT be more than 1
    // `DragDropContext` in the component tree.
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable {...getDroppableInfo(editableId)}>
        {(droppableProvided) => (
          <div
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            {children}
            {droppableProvided.placeholder}
          </div>
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
}
// TODO: Break this up into individual sub-components
// that can be selectively used to create the card
const EditableAccordionItem = ({
  title,
  children,
}: PropsWithChildren<EditableCardProps>) => {
  return (
    <BaseAccordionItem borderRadius="0.5rem">
      {/* NOTE: Check with design on styling. 
        See if entire section is button (ie, whole component hover styling)
      */}
      <AccordionButton px="1.5rem" py="3rem">
        <Flex flex="1" flexDir="column">
          <Text textStyle="h6" textAlign="left" mt="0.25rem">
            {title}
          </Text>
        </Flex>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4}>{children}</AccordionPanel>
    </BaseAccordionItem>
  )
}

interface DraggableAccordionItemProps {
  tag: JSX.Element
  title: string
  // TODO: Should get these props automatically
  // rather than having us pass in manually
  index: number
  draggableId: string
}
// NOTE: Separating editable/draggable
// due to semantics on `Draggables`
const DraggableAccordionItem = ({
  tag,
  title,
  children,
  index,
  draggableId,
}: PropsWithChildren<DraggableAccordionItemProps>) => {
  return (
    <Draggable draggableId={draggableId} index={index}>
      {(draggableProvided) => (
        <BaseAccordionItem
          borderRadius="0.25rem"
          {...draggableProvided.draggableProps}
          ref={draggableProvided.innerRef}
          // TODO: Ask design for the design token for this rgba value...
          boxShadow="0px 0px 10px 0px rgba(191, 191, 191, 0.50)"
        >
          <Center>
            <IconButton
              {...draggableProvided.dragHandleProps}
              variant="clear"
              cursor="grab"
              aria-label="drag item"
              icon={<BxDraggable />}
            />
          </Center>
          {/* NOTE: Check with design on styling. 
        See if entire section is button (ie, whole component hover styling)
      */}
          <AccordionButton px="1.5rem" pb="1.5rem">
            <Flex flex="1" flexDir="column">
              {tag}
              <Text textStyle="h6" textAlign="left" mt="0.25rem">
                {title}
              </Text>
            </Flex>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>{children}</AccordionPanel>
        </BaseAccordionItem>
      )}
    </Draggable>
  )
}

const EditableAccordion = (props: AccordionProps) => {
  return <Accordion allowToggle bg="base.canvas.default" {...props} />
}

export const Editable = {
  Sidebar: EditableSidebar,
  Draggable: EditableDraggable,
  EditableAccordionItem,
  Accordion: EditableAccordion,
  DraggableAccordionItem,
}
