// NOTE: Only `New Feature` for now but we can extend this for eg: `Bugfix` or `Rework`
export type TagVariant = "New Feature"

export type Announcement = {
  title: string
  description: string | JSX.Element
  image: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
  tags: TagVariant[]
}

export type AnnouncementBatch = {
  link?: string
  announcements: Announcement[]
  onCloseButtonText: string
}
