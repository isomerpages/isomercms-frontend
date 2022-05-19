import axios from "axios"
import FormField from "components/FormField"
import SaveDeleteButtons from "components/SaveDeleteButtons"
import PropTypes from "prop-types"
import { Component } from "react"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import FormContext from "./Form/FormContext"
import FormTitle from "./Form/FormTitle"

// axios settings
axios.defaults.withCredentials = true

export default class HyperlinkModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: props.text,
      link: "",
    }
  }

  changeHandler = (event) => {
    const { id, value } = event.target
    this.setState({
      [id]: value,
    })
  }

  render() {
    const { onSave, onClose } = this.props

    const { text, link } = this.state

    return (
      <>
        <div className={elementStyles.overlay}>
          <div className={elementStyles["modal-settings"]}>
            <div className={elementStyles.modalHeader}>
              <h1>Insert hyperlink</h1>
              <button type="button" onClick={onClose}>
                <i className="bx bx-x" />
              </button>
            </div>
            <div className={elementStyles.modalContent}>
              <div className={elementStyles.modalFormFields}>
                <FormContext isRequired>
                  <FormTitle>Text</FormTitle>
                  <FormField
                    placeholder="Text"
                    id="text"
                    value={text}
                    onChange={this.changeHandler}
                  />
                  <FormTitle>Link</FormTitle>
                  <FormField
                    placeholder="Link"
                    id="link"
                    value={link}
                    onChange={this.changeHandler}
                  />
                </FormContext>
              </div>
              <SaveDeleteButtons
                isDisabled={false}
                hasDeleteButton={false}
                saveCallback={() => {
                  onSave(text, link)
                }}
              />
            </div>
          </div>
        </div>
      </>
    )
  }
}

HyperlinkModal.propTypes = {
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}
