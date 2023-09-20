// eslint-disable-next-line import/prefer-default-export
export const BxGrayTranslucent = (
  props: React.SVGProps<SVGSVGElement>
): JSX.Element => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <mask
        id="mask0_15241_43184"
        style={{
          maskType: "alpha",
        }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="40"
        height="40"
      >
        <path d="M0 0H20V40H0V0Z" fill="#EAEAEA" />
        <path d="M26 0H34V8H26V0Z" fill="#D9D9D9" />
        <path d="M34 8H40V16H34V8Z" fill="#D9D9D9" />
        <path d="M18 8H26V16H18V8Z" fill="#D9D9D9" />
        <path d="M26 16H34V24H26V16Z" fill="#D9D9D9" />
        <path d="M34 24H40V32H34V24Z" fill="#D9D9D9" />
        <path d="M18 24H26V32H18V24Z" fill="#D9D9D9" />
        <path d="M26 32H34V40H26V32Z" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_15241_43184)">
        <path
          d="M20 2.38498e-07C22.6264 2.69818e-07 25.2272 0.517316 27.6537 1.52241C30.0802 2.5275 32.285 4.00069 34.1421 5.85787C35.9993 7.71504 37.4725 9.91982 38.4776 12.3463C39.4827 14.7728 40 17.3736 40 20C40 22.6264 39.4827 25.2272 38.4776 27.6537C37.4725 30.0802 35.9993 32.285 34.1421 34.1421C32.285 35.9993 30.0802 37.4725 27.6537 38.4776C25.2272 39.4827 22.6264 40 20 40L20 20L20 2.38498e-07Z"
          fill="#D9D9D9"
        />
      </g>
      <path
        d="M20 40C17.3736 40 14.7728 39.4827 12.3463 38.4776C9.91982 37.4725 7.71503 35.9993 5.85786 34.1421C4.00069 32.285 2.5275 30.0802 1.52241 27.6537C0.517314 25.2272 -1.10384e-06 22.6264 -8.74228e-07 20C-6.44617e-07 17.3736 0.517315 14.7728 1.52241 12.3463C2.5275 9.91982 4.00069 7.71503 5.85787 5.85786C7.71504 4.00069 9.91982 2.5275 12.3463 1.52241C14.7728 0.517315 17.3736 -3.44415e-07 20 0L20 20L20 40Z"
        fill="black"
      />
    </svg>
  )
}
