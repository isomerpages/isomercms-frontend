import {
  Avatar,
  AvatarBadge,
  Flex,
  MenuButtonProps,
  MenuListProps,
  Text,
} from "@chakra-ui/react"
import { Menu, Spinner } from "@opengovsg/design-system-react"
import { ContextMenuItem } from "components/ContextMenu/ContextMenuItem"
import { PropsWithChildren, useEffect, useState } from "react"
import { BiBell, BiDownArrowAlt } from "react-icons/bi"

import {
  useGetAllNotifications,
  useGetNotifications,
  useUpdateReadNotifications,
} from "hooks/notificationHooks"
import useRedirectHook from "hooks/useRedirectHook"

import { convertDateToTimeDiff } from "utils/dateUtils"
import { getNotificationIcon } from "utils/notificationUtils"
import { extractInitials } from "utils/text"

const NotificationMenuButton = (props: MenuButtonProps): JSX.Element => {
  return (
    <Menu.Button
      variant="clear"
      px="0"
      iconSpacing="0.5rem"
      rightIcon={undefined}
      _focus={{}}
      {...props}
    />
  )
}

interface NotificationMenuItemProps {
  name?: string
  icon?: JSX.Element
  link: string
  time: string
  isRead: boolean
}

export const NotificationMenuItem = ({
  name,
  icon,
  link,
  time,
  isRead,
  children,
}: PropsWithChildren<NotificationMenuItemProps>): JSX.Element => {
  const { setRedirectToPage } = useRedirectHook()
  return (
    <ContextMenuItem
      backgroundColor={isRead ? "background.default" : "blue.50"}
      onClick={() => setRedirectToPage(link)}
    >
      <Flex w="100%">
        <Avatar icon={icon || <></>} name={name ? extractInitials(name) : ""} />
        <Text
          w="100%"
          pl="1rem"
          noOfLines={3}
          fontSize="0.75rem"
          color="text.description"
          title={typeof children === "string" ? children : undefined}
        >
          {children}
        </Text>
        <Text
          pl="0.5rem"
          alignSelf="start"
          color="text.helper"
          fontSize="0.75rem"
        >
          {time}
        </Text>
      </Flex>
    </ContextMenuItem>
  )
}

interface NotificationMenuProps {
  siteName: string
  menuListProps?: MenuListProps
}

export const NotificationMenu = ({
  siteName,
  menuListProps,
}: NotificationMenuProps): JSX.Element => {
  const [displayAll, setDisplayAll] = useState(false)
  const [hasNotification, setHasNotification] = useState(false)
  const {
    data: allNotificationData,
    refetch: refetchAllNotificationData,
    isLoading: isGetAllNotificationLoading,
  } = useGetAllNotifications(siteName)
  const {
    data: recentNotificationData,
    refetch: refetchRecentNotificationData,
  } = useGetNotifications(siteName)

  const { mutateAsync: updateReadNotifications } = useUpdateReadNotifications()

  useEffect(() => {
    setDisplayAll(false)
    refetchRecentNotificationData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    recentNotificationData &&
      setHasNotification(
        recentNotificationData.some((notification) => !notification.isRead)
      )
  }, [recentNotificationData])
  return (
    <Menu autoSelect={false}>
      {({ isOpen }) => (
        <>
          <NotificationMenuButton
            onClick={() => {
              setHasNotification(false)
              updateReadNotifications({ siteName })
            }}
          >
            <Avatar
              icon={<BiBell />}
              bg="white"
              boxShadow={
                isOpen
                  ? `0 0 0 4px var(--chakra-colors-primary-300)`
                  : undefined
              }
            >
              {hasNotification && <AvatarBadge boxSize="1.25em" bg="red.500" />}
            </Avatar>
          </NotificationMenuButton>
          <Menu.List
            role="menu"
            marginTop="0.375rem"
            w="22.5rem"
            {...menuListProps}
          >
            {displayAll && allNotificationData ? (
              <>
                {allNotificationData.map((notification) => (
                  <NotificationMenuItem
                    name={notification.sourceUsername}
                    icon={
                      notification.sourceUsername
                        ? undefined
                        : getNotificationIcon(notification.type)
                    }
                    link={notification.link}
                    time={convertDateToTimeDiff(notification.createdAt)}
                    isRead={notification.isRead}
                  >
                    {notification.message}
                  </NotificationMenuItem>
                ))}
              </>
            ) : (
              <>
                {recentNotificationData &&
                  recentNotificationData.map((notification) => (
                    <NotificationMenuItem
                      name={notification.sourceUsername}
                      icon={
                        notification.sourceUsername
                          ? undefined
                          : getNotificationIcon(notification.type)
                      }
                      link={notification.link}
                      time={convertDateToTimeDiff(notification.createdAt)}
                      isRead={notification.isRead}
                    >
                      {notification.message}
                    </NotificationMenuItem>
                  ))}
                {recentNotificationData &&
                recentNotificationData.length === 0 ? (
                  <ContextMenuItem color="text.helper">
                    <Text fontSize="0.75rem" mr="0.5rem">
                      There are no notifications for display.
                    </Text>
                  </ContextMenuItem>
                ) : (
                  <ContextMenuItem
                    color="text.link.default"
                    closeOnSelect={false}
                    onClick={() => {
                      setDisplayAll(true)
                      refetchAllNotificationData()
                    }}
                  >
                    <Text fontSize="0.875rem" mr="0.5rem">
                      See earlier notifications
                    </Text>
                    {isGetAllNotificationLoading ? (
                      <Spinner />
                    ) : (
                      <BiDownArrowAlt />
                    )}
                  </ContextMenuItem>
                )}
              </>
            )}
          </Menu.List>
        </>
      )}
    </Menu>
  )
}
