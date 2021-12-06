import immer from 'immer'
import zustand from 'zustand'
import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { useMediaQuery } from '@mui/material'
import theme from '../../configs/theme'
import isNil from 'lodash/isNil'

export interface IOpenModalParam {
  title: string | React.ElementType
  body: string | React.ElementType
  okText: string
  cancelText: string

  Actions: React.ElementType

  fullScreen?: boolean
  maxWidth?: string
}

export type IOpenModalFunctionType = (IOpenModalParam) => Promise<any>

const defaultValue = {
  title: 'Konfirmasi',
  body: '',
  open: false,

  okText: 'Ya',
  cancelText: 'Batalkan',
  Actions: null,

  fullScreen: false,
  maxWidth: 'sm',

}

const useModal = zustand<{
  title: string | React.ElementType
  body: string | React.ElementType

  okText: string
  cancelText: string
  Actions: React.ElementType

  open: boolean

  _openModal: IOpenModalFunctionType
  _closeModal: () => void
  _resolve: (d: any, closeModal?: boolean) => void

  fullScreen?: boolean
  maxWidth?: string
}>((set, get) => ({
  ...defaultValue,

  _resolve: () => {},

  _closeModal: () => {
    return set(
      immer((draft) => {
        draft.open = false
      })
    )
  },

  _openModal: ({ title, body, fullScreen, maxWidth, okText, cancelText, Actions}) => {
    const promise = new Promise((resolve, reject) => {
      set(
        immer((draft) => {
          draft.open = true
          draft.title = !isNil(title) ? title : defaultValue.title
          draft.body = body

          draft.okText = !isNil(okText) ? okText : defaultValue.okText
          draft.cancelText = !isNil(cancelText) ? cancelText : defaultValue.cancelText
          draft.Actions = !isNil(Actions) ? Actions : defaultValue.Actions

          draft.maxWidth = !isNil(maxWidth) ? maxWidth : defaultValue.maxWidth
          draft.fullScreen = fullScreen

          draft._resolve = (d, closeModal) => {
            if (closeModal == true || isNil(closeModal)) get()._closeModal()
            return resolve(d)
          }
        })
      )
    })
    return promise
  },
}))

export default useModal

export const AppDialog = () => {
  const fullScreenMedia = useMediaQuery(theme.breakpoints.down('sm'))

  const {
    open,
    title,
    body,
    okText,
    cancelText,
    _resolve,
    fullScreen,
    maxWidth,
    Actions
  } = useModal((state) => ({
    open: state.open,
    title: state.title,
    body: state.body,
    okText: state.okText,
    cancelText: state.cancelText,
    _resolve: state._resolve,
    fullScreen: state.fullScreen,
    maxWidth: state.maxWidth,
    Actions: state.Actions,
  }))

  const { _closeModal } = useModal(
    (state) => ({ _closeModal: state._closeModal }),
    () => true
  )

  const _handleOk = () => {
    _resolve({})
  }

  const _handleCancel = () => {
    _resolve(false)
  }

  return (
    <Dialog
      fullScreen={fullScreen || fullScreenMedia}
      fullWidth={true}
      maxWidth={maxWidth}
      open={open}
      onClose={_closeModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      TransitionComponent={Transition}
    >
      {title && <DialogTitle id="alert-dialog-title">{title}</DialogTitle>}
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {body}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ background: 'rgb(229, 231, 235)' }}>

        {(!Actions && cancelText) && (
          <Button onClick={_handleCancel} color="primary">
            {cancelText}
          </Button>
        )}
        {(!Actions && okText) && (
          <Button
            variant="contained"
            onClick={_handleOk}
            color="primary"
            autoFocus
          >
            {okText}
          </Button>
        )}

        {Actions && <Actions _resolve={_resolve} />}

      </DialogActions>
    </Dialog>
  )
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})
