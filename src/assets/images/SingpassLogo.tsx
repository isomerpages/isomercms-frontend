import { chakra } from "@chakra-ui/react"

export const SingpassLogo = chakra(
  (props: React.SVGProps<SVGSVGElement>): JSX.Element => {
    return (
      <svg
        width="74"
        height="17"
        viewBox="0 0 74 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <g id="singpass" clipPath="url(#clip0_16295_2344)">
          <path
            id="Vector"
            d="M4.61883 12.9066C2.61134 12.9066 1.19076 12.2223 0.568726 11.6466L1.90105 9.66666C2.73558 10.3865 3.76632 10.7469 4.61883 10.7469C5.3471 10.7469 5.6667 10.5307 5.6667 10.1347C5.6667 9.82905 5.41823 9.59458 4.63682 9.41483L3.05602 9.03708C1.51035 8.67584 0.782069 7.72148 0.782069 6.40761C0.782069 4.60745 2.20265 3.54541 4.31637 3.54541C5.95029 3.54541 7.26463 4.04907 7.90466 4.62568L6.57233 6.6056C5.98627 6.06546 5.13376 5.66948 4.31637 5.66948C3.64121 5.66948 3.33963 5.90395 3.33963 6.26346C3.33963 6.62296 3.65921 6.82184 4.26325 6.96511L5.84406 7.32549C7.45998 7.68587 8.24223 8.56728 8.24223 9.86378C8.24223 11.7178 6.87393 12.9066 4.61883 12.9066ZM14.1036 12.726H16.7683V7.88387C16.7683 6.6959 17.3363 5.95778 18.4382 5.95778C19.4861 5.95778 20.037 6.56999 20.037 7.88387V12.7268H22.7016V7.19958C22.7016 4.7872 21.5116 3.54541 19.4689 3.54541C18.2968 3.54541 17.4083 4.01347 16.7691 4.93135V4.35561C16.7691 3.95963 16.5387 3.72517 16.1471 3.72517H14.1045V12.726H14.1036ZM33.5008 3.72517V11.5198C33.5008 14.9039 31.3338 16.2542 28.6692 16.2542C26.8931 16.2542 25.4185 15.7862 24.5309 14.976L25.9163 12.8875C26.5025 13.4632 27.444 13.986 28.6692 13.986C30.0368 13.986 30.8362 13.1037 30.8362 11.8802V11.3044C30.1969 12.1146 29.2733 12.4741 28.1363 12.4741C25.9874 12.4741 24.1222 10.5663 24.1222 8.00978C24.1222 5.45325 25.9874 3.54541 28.1363 3.54541C29.2733 3.54541 30.232 3.97787 30.8362 4.89575V4.35561C30.8362 3.95963 31.0675 3.72517 31.4581 3.72517H33.5008ZM30.9252 8.00978C30.9252 6.84007 30.0546 5.92131 28.8474 5.92131C27.7286 5.92131 26.8228 6.83919 26.8228 8.00978C26.8228 9.17949 27.7286 10.0982 28.8474 10.0982C30.0546 10.0982 30.9252 9.17949 30.9252 8.00978ZM45.1524 8.22601C45.1524 10.9988 43.2871 12.9066 40.978 12.9066C39.77 12.9066 38.8112 12.5462 38.118 11.7369V16.0397H35.4534V3.72517H37.4968C37.8876 3.72517 38.1189 3.95963 38.1189 4.35561V4.89575C38.776 3.97787 39.7708 3.54541 40.9789 3.54541C43.2879 3.54541 45.1524 5.45325 45.1524 8.22601ZM42.4526 8.22601C42.4526 6.87567 41.5111 5.92131 40.2678 5.92131C39.0066 5.92131 38.0299 6.87567 38.0299 8.22601C38.0299 9.57634 39.0066 10.5307 40.2678 10.5307C41.5118 10.5298 42.4526 9.57548 42.4526 8.22601ZM55.9875 3.72517V12.726H53.3229V11.5563C52.6658 12.4741 51.671 12.9066 50.4629 12.9066C48.1538 12.9066 46.2885 10.9988 46.2885 8.22601C46.2885 5.45325 48.1538 3.54541 50.4629 3.54541C51.671 3.54541 52.6658 3.97787 53.3229 4.89575V4.35561C53.3229 3.95963 53.5542 3.72517 53.945 3.72517H55.9875ZM53.4119 8.22601C53.4119 6.87567 52.4351 5.92131 51.174 5.92131C49.9307 5.92131 48.9892 6.87567 48.9892 8.22601C48.9892 9.57634 49.9307 10.5307 51.174 10.5307C52.4351 10.5298 53.4119 9.57548 53.4119 8.22601ZM61.388 12.9066C63.644 12.9066 65.0113 11.7187 65.0113 9.86466C65.0113 8.56816 64.23 7.68675 62.6131 7.32637L61.0323 6.96598C60.4283 6.82184 60.1086 6.62384 60.1086 6.26432C60.1086 5.90481 60.4104 5.67034 61.0854 5.67034C61.9028 5.67034 62.7554 6.06634 63.3414 6.60646L64.6738 4.62655C64.0346 4.05081 62.7203 3.54628 61.0854 3.54628C58.9717 3.54628 57.5511 4.60831 57.5511 6.40848C57.5511 7.72234 58.2794 8.6767 59.8251 9.03708L61.4059 9.41483C62.1873 9.59458 62.4357 9.82905 62.4357 10.1347C62.4357 10.5307 62.1163 10.7469 61.388 10.7469C60.5353 10.7469 59.5055 10.3865 58.6701 9.66666L57.3378 11.6466C57.9599 12.2223 59.3804 12.9066 61.388 12.9066ZM69.8068 12.9066C72.0627 12.9066 73.4303 11.7187 73.4303 9.86466C73.4303 8.56816 72.6489 7.68675 71.032 7.32637L69.4512 6.96598C68.8472 6.82184 68.5276 6.62384 68.5276 6.26432C68.5276 5.90481 68.8292 5.67034 69.5043 5.67034C70.3218 5.67034 71.1743 6.06634 71.7603 6.60646L73.0928 4.62655C72.4535 4.05081 71.1393 3.54628 69.5043 3.54628C67.3907 3.54628 65.97 4.60831 65.97 6.40848C65.97 7.72234 66.6983 8.6767 68.244 9.03708L69.8248 9.41483C70.6062 9.59458 70.8547 9.82905 70.8547 10.1347C70.8547 10.5307 70.535 10.7469 69.8068 10.7469C68.9543 10.7469 67.9244 10.3865 67.0891 9.66666L65.7568 11.6466C66.3789 12.2223 67.8002 12.9066 69.8068 12.9066Z"
            fill="white"
          />
          <path
            id="Vector_2"
            d="M10.8714 6.84176C11.7419 6.84176 12.4171 6.15746 12.4171 5.27518C12.4171 4.3929 11.7419 3.70862 10.8714 3.70862C10.0009 3.70862 9.32578 4.3929 9.32578 5.27518C9.32662 6.15746 10.0009 6.84176 10.8714 6.84176ZM9.20154 12.9621H12.5405L11.8302 7.36364C11.2973 7.52605 10.4448 7.52605 9.91182 7.36364L9.20154 12.9621Z"
            fill="white"
          />
        </g>
        <defs>
          <clipPath id="clip0_16295_2344">
            <rect
              width="72.8"
              height="16"
              fill="white"
              transform="translate(0.599976 0.5)"
            />
          </clipPath>
        </defs>
      </svg>
    )
  }
)