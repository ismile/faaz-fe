import immer from 'immer'
import zustand from 'zustand'
import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

const useModal = zustand((set, get) => ({
  title: 'Konfirmasi',
  body: '',
  open: false,
  okText: 'Ya',
  cancelText: 'Batalkan',
  _resolve: ()=> {},

  _close: () => {
    return set(
      immer((draft) => {
        draft.open = false
      })
    )
  },

  _open: ({ title, body }={}) => {
    const promise = new Promise((resolve, reject) => {
      set(
        immer((draft) => {
          draft.open = true
          if (title) draft.title = title
          draft.body = body
          draft._resolve = resolve
        })
      )
    })
    return promise
  },
}))

export default useModal

export const AppDialog = () => {
  const { open, title, body, okText, cancelText, _resolve } = useModal((state) => ({
    open: state.open,
    title: state.title,
    body: state.body,
    okText: state.okText,
    cancelText: state.cancelText,
    _resolve: state._resolve,
  }))

  const { _close } = useModal(
    (state) => ({ _close: state._close }),
    () => true
  )

  const _handleOk = ()=> {
    _resolve({})
    _close()
  }

  const _handleCancel = ()=> {
    _resolve(false)
    _close()
  }

  return (
    <Dialog
      open={open}
      onClose={_close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {body}
        </DialogContentText>
      </DialogContent>
      <DialogActions className="bg-gray-100">
        <Button onClick={_handleCancel} color="primary">
          {cancelText}
        </Button>
        <Button variant="contained" onClick={_handleOk} color="primary" autoFocus>
          {okText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
