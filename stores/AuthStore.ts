import immer from 'immer'
import zustand from 'zustand'
import axios from 'axios'
import { IUserModel } from './UserStore'
import { setCookies } from 'cookies-next'
import { NAMESPACE } from '../configs/constant'

export const useAuthStore = zustand<{
  loggedInUser?: IUserModel
  token?: String
  refreshToken?: String
  expiresAt?: Date

  _login: (data: any) => void
  _me: () => void
}>((set, get) => ({
  loggedInUser: null,
  token: null,
  refreshToken: null,
  expiresAt: null,

  _login: async (data) => {
    const res = await axios.post(`/auth/login`, data)
    setCookies(`${NAMESPACE}_REFRESH_TOKEN`, res.data.refreshToken)
    setCookies(`${NAMESPACE}_TOKEN`, res.data.token)
    axios.defaults.headers.common.Authorization = 'bearer ' + res.data.token
    set(
      immer((draft) => {
        draft.loggedInUser = res.data.user
        draft.token = res.data.token
        draft.refreshToken = res.data.refreshToken
        draft.expiresAt = new Date(res.data.expiresAt)
      })
    )
    return res
  },

  _me: async () => {
    const res = await axios.get(`/auth/me`)
    set(
      immer((draft) => {
        draft.loggedInUser = res.data
      })
    )
    return res.data
  },
}))
