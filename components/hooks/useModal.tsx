import immer from 'immer'
import zustand from 'zustand'
import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

const useModal = zustand((set, get) => ({
  title: 'Konfirmasi',
  body: '',
  open: false,
  okText: 'Ya',
  cancelText: 'Batalkan',
  _resolve: ()=> {},

  _closeModal: () => {
    return set(
      immer((draft) => {
        draft.open = false
      })
    )
  },

  _openModal: ({ title, body }={}) => {
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

  const { _closeModal } = useModal(
    (state) => ({ _closeModal: state._closeModal }),
    () => true
  )

  const _handleOk = ()=> {
    _resolve({})
    _closeModal()
  }

  const _handleCancel = ()=> {
    _resolve(false)
    _closeModal()
  }

  return (
    <Dialog
      open={open}
      onClose={_closeModal}
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
