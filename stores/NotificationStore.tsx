import immer from 'immer'
import zustand from 'zustand'
import axios, { AxiosResponse } from 'axios'
import { useSnackbar, OptionsObject } from 'notistack'
import { useEffect } from 'react'
import { NAMESPACE } from '../configs/constant'

export interface NotificationMessage {
  message: string
  statusCode?: number
  detail?: string
  variant?: string
}

export const useNotificationStore = zustand<{
  notifications: Array<NotificationMessage>
  _push: (data: NotificationMessage) => void
  _init: (data: Array<NotificationMessage>) => void
}>((set, get) => ({
  notifications: [],

  _push: (data: NotificationMessage) => {
    set(
      immer((draft) => {
        draft.notifications.push(data)
        localStorage.setItem(
          `${NAMESPACE}.notifications`,
          JSON.stringify(draft.notifications)
        )
      })
    )
  },

  _init: (notifications) => {
    set(
      immer((draft) => {
        draft.notifications = notifications
      })
    )
  },
}))

export function NotificationAdapter() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const [_push, _init] = useNotificationStore(
    (state) => [state._push, state._init],
    () => true
  )

  useEffect(() => {
    if (window) {
      if (localStorage.getItem(`${NAMESPACE}.notifications`))
        _init(JSON.parse(localStorage.getItem(`${NAMESPACE}.notifications`)))
      window.showSnackbar = (data: NotificationMessage, opt) => {
        enqueueSnackbar(data.message, {
          variant: data.variant ? data.variant : 'info',
          ...opt,
        })
        _push(data)
      }
    }
  }, [])

  return <div />
}

export function showSnackbar(data: NotificationMessage, opt?: OptionsObject) {
  if (window) window.showSnackbar(data, opt)
}
