import elementStyles from "styles/isomer-cms/Elements.module.scss"

export default function Home() {
  return (
    <div className={elementStyles.loginDiv}>
      <div>
        <img
          className={elementStyles.loginImage}
          src={`${process.env.PUBLIC_URL}/img/logo.svg`}
          alt="Isomer CMS logo"
        />
        <button
          type="button"
          onClick={() => {
            window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/github-redirect`
          }}
          className={`${elementStyles.green} ${elementStyles.loginButton}`}
        >
          Login with GitHub
        </button>
      </div>
    </div>
  )
}
