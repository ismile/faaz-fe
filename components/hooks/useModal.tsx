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
  title?: string | React.ElementType | boolean
  body: string | React.ElementType
  okText?: string | boolean
  cancelText?: string | boolean

  onOk?: (_resolve, customProps) => void
  onCancel?: (_resolve, customProps) => void

  actions?: React.ElementType

  data?: Object
  customProps?: Object

  fullScreen?: boolean
  maxWidth?: string
}

export type IOpenModalFunctionType = (p: IOpenModalParam) => Promise<any>

const defaultValue = {
  title: 'Konfirmasi',
  body: '',
  open: false,

  okText: 'Ya',
  cancelText: 'Batalkan',
  actions: null,

  onOk: (_resolve, customProps) => {
    _resolve(true)
  },
  onCancel: (_resolve, customProps) => {
    _resolve(false)
  },
  _resolve: () => {},

  data: {},
  customProps: {},

  fullScreen: false,
  maxWidth: 'sm',
}

const useModal = zustand<{
  title: string | React.ElementType | boolean
  body: string | React.ElementType | boolean

  okText: string
  cancelText: string
  actions: React.ElementType

  onOk?: (_resolve: any, customProps) => void
  onCancel?: (_resolve: any, customProps) => void

  data?: Object
  customProps?: Object

  open: boolean

  _openModal: IOpenModalFunctionType
  _closeModal: () => void
  _resolve: (d: any, closeModal?: boolean) => void
  _setData: (data: any) => void
  _setCustomProps: (customProps: any) => void

  fullScreen?: boolean
  maxWidth?: string
}>((set, get) => ({
  ...defaultValue,

  _closeModal: () => {
    return set(
      immer((draft) => {
        draft.open = false
      })
    )
  },

  _openModal: ({
    title,
    body,
    fullScreen,
    maxWidth,
    okText,
    cancelText,
    actions,
    onOk,
    onCancel,
  }) => {
    const promise = new Promise((resolve, reject) => {
      set(
        immer((draft) => {
          draft.open = true
          draft.title = !isNil(title) ? title : defaultValue.title
          draft.body = body

          draft.okText = !isNil(okText) ? okText : defaultValue.okText
          draft.cancelText = !isNil(cancelText)
            ? cancelText
            : defaultValue.cancelText
          draft.actions = !isNil(actions) ? actions : defaultValue.actions

          draft.maxWidth = !isNil(maxWidth) ? maxWidth : defaultValue.maxWidth
          draft.fullScreen = fullScreen

          draft._resolve = (d, closeModal) => {
            if (closeModal == true || isNil(closeModal)) get()._closeModal()
            return resolve(d)
          }

          draft.onOk = !isNil(onOk) ? onOk : defaultValue.onOk
          draft.onCancel = !isNil(onCancel) ? onCancel : defaultValue.onCancel
        })
      )
    })
    return promise
  },

  _setData: (data) => {
    return set(
      immer((draft) => {
        draft.data = data
      })
    )
  },

  _setCustomProps: (customProps) => {
    return set(
      immer((draft) => {
        draft.customProps = customProps
      })
    )
  },
}))

export default useModal

export const AppDialog = () => {
  const fullScreenMedia = useMediaQuery(theme.breakpoints.down('sm'))

  const {
    open,
    title,
    body,
    HtmlBody,
    okText,
    cancelText,
    _resolve,
    fullScreen,
    maxWidth,
    Actions,
    _setData,
    _setCustomProps,
    onOk,
    onCancel,
    data,
    customProps
  } = useModal((state) => ({
    open: state.open,
    title: state.title,
    body: state.body,
    HtmlBody: state.body,
    okText: state.okText,
    cancelText: state.cancelText,
    _resolve: state._resolve,
    fullScreen: state.fullScreen,
    maxWidth: state.maxWidth,
    Actions: state.actions,
    _setData: state._setData,
    _setCustomProps: state._setCustomProps,
    onOk: state.onOk,
    onCancel: state.onCancel,
    data: state.data,
    customProps: state.customProps
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
      {(typeof body == 'string' || typeof body == 'object') && (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {body}
          </DialogContentText>
        </DialogContent>
      )}
      {typeof body == 'function' && (
        <HtmlBody
          _setCustomProps={_setCustomProps}
          _resolve={_resolve}
        />
      )}
      <DialogActions sx={{ bgcolor: 'background.default' }}>
        {!Actions && cancelText && (
          <Button onClick={() => onCancel(_resolve, customProps)} color="primary">
            {cancelText}
          </Button>
        )}
        {!Actions && okText && (
          <Button
            variant="contained"
            onClick={() => onOk(_resolve, customProps)}
            color="primary"
            autoFocus
          >
            {okText}
          </Button>
        )}

        {Actions && <Actions _resolve={_resolve} customProps={customProps} />}
      </DialogActions>
    </Dialog>
  )
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})
