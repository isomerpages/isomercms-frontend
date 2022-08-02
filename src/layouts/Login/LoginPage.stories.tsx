import { ComponentStory, ComponentMeta } from "@storybook/react"
import { rest } from "msw"
import { MemoryRouter, Route } from "react-router-dom"

import { handlers } from "../../mocks/handlers"

import { LoginPage } from "./LoginPage"

const SEND_OTP_ENDPOINT = `${process.env.BACKEND_URL_V2}/auth/login`
const VERIFY_OTP_ENDPOINT = `${process.env.BACKEND_URL_V2}/auth/verify`
const LOGOUT_ENDPOINT = `${process.env.BACKEND_URL_V2}/auth/logout`

const LoginPageMeta = {
  title: "Pages/LoginPage",
  component: LoginPage,
  parameters: {
    // Set delay so mock API requests will get resolved and the UI will render properly
    chromatic: { delay: 500 },
    msw: {
      handlers,
    },
  },
  decorators: [
    (Story) => {
      return (
        <MemoryRouter initialEntries={["/"]}>
          <Route path="/">
            <Story />
          </Route>
        </MemoryRouter>
        // </ServicesContext.Provider>
      )
    },
  ],
} as ComponentMeta<typeof LoginPage>

const Template: ComponentStory<typeof LoginPage> = LoginPage

export const Default = Template.bind({})
Default.parameters = {
  msw: {
    handlers: [
      rest.post(SEND_OTP_ENDPOINT, (req, res, ctx) => {
        return res(ctx.json({}))
      }),
      rest.post(VERIFY_OTP_ENDPOINT, (req, res, ctx) => {
        return res(ctx.json({}))
      }),
      ...handlers,
    ],
  },
}

export const NotWhitelisted = Template.bind({})
NotWhitelisted.parameters = {
  msw: {
    handlers: [
      rest.post(SEND_OTP_ENDPOINT, (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({
            error: {
              message:
                "Please sign in with a gov.sg or other whitelisted email.",
            },
          })
        )
      }),
      rest.delete(LOGOUT_ENDPOINT, (req, res, ctx) => {
        return res(ctx.json({}))
      }),
      ...handlers,
    ],
  },
}

export const WrongOtp = Template.bind({})
WrongOtp.parameters = {
  msw: {
    handlers: [
      rest.post(SEND_OTP_ENDPOINT, (req, res, ctx) => {
        return res(ctx.json({}))
      }),
      rest.post(VERIFY_OTP_ENDPOINT, (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({
            error: {
              message: "You have entered an invalid OTP.",
            },
          })
        )
      }),
      rest.delete(LOGOUT_ENDPOINT, (req, res, ctx) => {
        return res(ctx.json({}))
      }),
      ...handlers,
    ],
  },
}

export default LoginPageMeta
