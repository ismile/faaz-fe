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
import theme from '../../../configs/theme'
import isNil from 'lodash/isNil'
import { SxProps } from '@material-ui/system';

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
  sx?: SxProps,
  fullWidth?: boolean
}

export type IOpenModalFunctionType = (
  p: IOpenModalParam,
  id?: string
) => Promise<any>

interface IDefaultModalState {
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
  _setCustomProps: (customProps: any) => void

  fullScreen?: boolean
  maxWidth?: string
}

const defaultValue = {
  modals: {
    default: {
      id: 'default',
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
    },
  },
}

const useModal = zustand<{
  modals: object
  _setData: (data: any, id?: string) => void
  _openModal: IOpenModalFunctionType
  _closeModal: (id?: string) => void
  _cleanModal: (id: string) => void
  _setCustomProps: (customProps: any, id?: string) => void
}>((set, get) => ({
  ...defaultValue,

  _cleanModal: (id: string) => {
    return set(
      immer((draft) => {
        delete draft.modals[id];
      })
    )
  },

  _closeModal: (id = 'default') => {
    return set(
      immer((draft) => {
        draft.modals[id].open = false

        if(id != 'default') {
          setTimeout(()=> {
            get()._cleanModal(id)
          }, 1000)
        }
      })
    )
  },

  _openModal: (
    {
      title,
      body,
      fullScreen,
      maxWidth,
      okText,
      cancelText,
      actions,
      onOk,
      onCancel,
      sx,
      fullWidth
    },
    id = 'default'
  ) => {
    const promise = new Promise((resolve, reject) => {
      set(
        immer((draft) => {
          if(!draft.modals[id]) draft.modals[id] = {}
          draft.modals[id].id = id
          draft.modals[id].sx = sx
          draft.modals[id].fullWidth = fullWidth == null|| fullWidth === undefined ? true:fullWidth
          draft.modals[id].open = true
          draft.modals[id].title = !isNil(title)
            ? title
            : defaultValue.modals.default.title
          draft.modals[id].body = body

          draft.modals[id].okText = !isNil(okText)
            ? okText
            : defaultValue.modals.default.okText
          draft.modals[id].cancelText = !isNil(cancelText)
            ? cancelText
            : defaultValue.modals.default.cancelText
          draft.modals[id].actions = !isNil(actions)
            ? actions
            : defaultValue.modals.default.actions

          draft.modals[id].maxWidth = !isNil(maxWidth)
            ? maxWidth
            : defaultValue.modals.default.maxWidth
          draft.modals[id].fullScreen = fullScreen

          draft.modals[id]._resolve = (d, closeModal) => {
            if (closeModal == true || isNil(closeModal)) get()._closeModal(id)
            return resolve(d)
          }

          draft.modals[id].onOk = !isNil(onOk)
            ? onOk
            : defaultValue.modals.default.onOk
          draft.modals[id].onCancel = !isNil(onCancel)
            ? onCancel
            : defaultValue.modals.default.onCancel
        })
      )
    })
    return promise
  },

  _setData: (data, id = 'default') => {
    return set(
      immer((draft) => {
        draft.modals[id].data = data
      })
    )
  },

  _setCustomProps: (customProps, id = 'default') => {
    return set(
      immer((draft) => {
        draft.modals[id].customProps = customProps
      })
    )
  },
}))

export default useModal

export const AppDialog = () => {
  const fullScreenMedia = useMediaQuery(theme.breakpoints.down('sm'))

  const {
    // open,
    // title,
    // body,
    // HtmlBody,
    // okText,
    // cancelText,
    // _resolve,
    // fullScreen,
    // maxWidth,
    // Actions,
    modals,
    _setData,
    _setCustomProps,
    // onOk,
    // onCancel,
    // data,
    // customProps,
  } = useModal((state) => ({
    // open: state.open,
    // title: state.title,
    // body: state.body,
    // HtmlBody: state.body,
    // okText: state.okText,
    // cancelText: state.cancelText,
    // _resolve: state._resolve,
    // fullScreen: state.fullScreen,
    // maxWidth: state.maxWidth,
    // Actions: state.actions,
    modals: state.modals,
    _setData: state._setData,
    _setCustomProps: state._setCustomProps,
    // onOk: state.onOk,
    // onCancel: state.onCancel,
    // data: state.data,
    // customProps: state.customProps,
  }))

  const { _closeModal } = useModal(
    (state) => ({ _closeModal: state._closeModal }),
    () => true
  )

  return (
    <>
      {Object.keys(modals).map((k) => {
        const {
          id,
          open,
          title,
          body,
          okText,
          cancelText,
          _resolve,
          fullScreen,
          maxWidth,
          onOk,
          onCancel,
          data,
          customProps,
          actions,
          sx,
          fullWidth
        } = modals[k]
        const Actions = modals[k].actions;
        const HtmlBody =  modals[k].body;

        return (
          <Dialog
            key={'modal-'+id}
            sx={sx}
            fullScreen={fullScreen || fullScreenMedia}
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            open={open}
            onClose={()=>_closeModal(id)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            TransitionComponent={Transition}
          >
            {title && (
              <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            )}
            {(typeof body == 'string' || typeof body == 'object') && (
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {body}
                </DialogContentText>
              </DialogContent>
            )}
            {typeof body == 'function' && (
              <HtmlBody _setCustomProps={_setCustomProps} _resolve={_resolve} />
            )}
            <DialogActions sx={{ bgcolor: 'background.default' }}>
              {!Actions && cancelText && (
                <Button
                  onClick={() => onCancel(_resolve, customProps)}
                  color="primary"
                >
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

              {Actions && (
                <Actions _resolve={_resolve} customProps={customProps} />
              )}
            </DialogActions>
          </Dialog>
        )
      })}
    </>
  )
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})
