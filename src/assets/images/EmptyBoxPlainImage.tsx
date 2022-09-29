export const EmptyBoxPlainImage = (
  props: React.SVGProps<SVGSVGElement>
): JSX.Element => {
  return (
    <svg
      width="110"
      height="52"
      viewBox="0 0 110 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <path
        d="M98.2244 1H13.2948V51H98.2244V1Z"
        fill="white"
        stroke="#A0A0A0"
      />
      <path
        d="M1.49542 16.3042H37.4768L49.2764 1H13.2949L1.49542 16.3042Z"
        fill="white"
        stroke="#A0A0A0"
      />
      <path
        d="M98.2244 1H49.2762V51H98.2244V1Z"
        fill="white"
        stroke="#A0A0A0"
      />
      <path
        d="M59.6734 16.3042H108.505L98.1076 1H49.2763L59.6734 16.3042Z"
        fill="white"
        stroke="#A0A0A0"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36.074 39.4336H17.7326V45.8585H36.074V39.4336Z"
        fill="white"
        stroke="#A0A0A0"
      />
    </svg>
  )
}
