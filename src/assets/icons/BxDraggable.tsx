export const BxDraggable = (
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
      <circle cx="6" cy="9" r="2" fill="#BABECB" />
      <circle cx="12" cy="9" r="2" fill="#BABECB" />
      <circle cx="18" cy="9" r="2" fill="#BABECB" />
      <circle cx="6" cy="15" r="2" fill="#BABECB" />
      <circle cx="12" cy="15" r="2" fill="#BABECB" />
      <circle cx="18" cy="15" r="2" fill="#BABECB" />
    </svg>
  )
}
