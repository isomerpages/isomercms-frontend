export const BxDraggableVertical = (
  props: React.SVGProps<SVGSVGElement>
): JSX.Element => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="9" cy="18" r="2" fill="#BABECB" />
      <circle cx="9" cy="12" r="2" fill="#BABECB" />
      <circle cx="9" cy="6" r="2" fill="#BABECB" />
      <circle cx="15" cy="18" r="2" fill="#BABECB" />
      <circle cx="15" cy="12" r="2" fill="#BABECB" />
      <circle cx="15" cy="6" r="2" fill="#BABECB" />
    </svg>
  )
}
