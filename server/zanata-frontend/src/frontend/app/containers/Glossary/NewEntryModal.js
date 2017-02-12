import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { cloneDeep, isEmpty } from 'lodash'
import { EditableText, LoaderText, Modal } from '../../components'
import { ButtonGroup, Button } from 'react-bootstrap'
import {
  glossaryToggleNewEntryModal,
  glossaryCreateNewEntry
} from '../../actions/glossary'

class NewEntryModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      entry: cloneDeep(props.entry)
    }
  }

  handleContentChanged (e) {
    const { entry } = this.state
    const { srcTerm } = entry
    this.setState({
      entry: {
        ...entry,
        srcTerm: {
          ...srcTerm,
          content: e.target.value
        }
      }
    })
  }

  handlePosChanged (e) {
    const { entry } = this.state
    this.setState({
      entry: {
        ...entry,
        pos: e.target.value
      }
    })
  }

  handleDescChanged (e) {
    const { entry } = this.state
    this.setState({
      entry: {
        ...entry,
        description: e.target.value
      }
    })
  }

  handleCancel () {
    this.resetFields()
    this.props.handleNewEntryDisplay(false)
  }

  resetFields () {
    this.setState({
      entry: cloneDeep(this.props.entry)
    })
  }

  render () {
    const {
      show,
      isSaving,
      handleNewEntryDisplay,
      handleNewEntryCreate
      } = this.props
    const isAllowSave = !isEmpty(this.state.entry.srcTerm.content)

    /* eslint-disable react/jsx-no-bind, react/jsx-boolean-value */
    return (
      <Modal
        show={show}
        onHide={() => { this.handleCancel(); handleNewEntryDisplay(false) }}
        rootClose>
        <Modal.Header>
          <Modal.Title>New Term</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-left'>
          <div className='modal-section'>
            <label className='text-bold'>Term</label>
            <EditableText
              className='editable text-state-classes'
              editable={true}
              editing={true}
              placeholder='The new term'
              maxLength={255}
              onChange={::this.handleContentChanged}>
              {this.state.entry.srcTerm.content}
            </EditableText>
          </div>
          <div className='modal-section'>
            <label className='text-bold'>Part of speech</label>
            <EditableText
              className='text-input modal-section'
              editable={true}
              editing={true}
              placeholder='Noun, Verb, etc'
              maxLength={255}
              onChange={::this.handlePosChanged}>
              {this.state.entry.pos}
            </EditableText>
          </div>
          <div className='modal-section'>
            <label className='text-bold'>Description</label>
            <EditableText
              className='text-input'
              editable={true}
              editing={true}
              placeholder='The definition of this term'
              maxLength={255}
              onChange={::this.handleDescChanged}>
              {this.state.entry.description}
            </EditableText>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup className='pull-right'>
            <Button bsStyle='link'
              disabled={isSaving}
              onClick={() => this.handleCancel()}>
              Cancel
            </Button>
            <Button bsStyle='primary'
              type='button'
              disabled={!isAllowSave || isSaving}
              onClick={
                () => {
                  handleNewEntryCreate(this.state.entry); this.resetFields()
                }
              }>
              <LoaderText loading={isSaving} loadingText='Saving'>
                Save
              </LoaderText>
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal>)
    /* eslint-enable react/jsx-no-bind, react/jsx-boolean-value */
  }
}

NewEntryModal.propTypes = {
  entry: PropTypes.object,
  isSaving: PropTypes.bool,
  show: PropTypes.bool,
  handleNewEntryDisplay: PropTypes.func,
  handleNewEntryCreate: PropTypes.func

}

const mapStateToProps = (state) => {
  const { entry, isSaving, show } = state.glossary.newEntry
  return { entry, isSaving, show }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    handleNewEntryDisplay: (display) =>
      dispatch(glossaryToggleNewEntryModal(display)),
    handleNewEntryCreate: (entry) => dispatch(glossaryCreateNewEntry(entry))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewEntryModal)
