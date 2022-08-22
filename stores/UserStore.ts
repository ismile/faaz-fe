import storeCreator from '../components/creators/storeCreator'

export interface IUserModel {
  id: string
  firstName: string
  lastName: string
}

const { useStore } = storeCreator<IUserModel>({
  apiPath: '/api/user',
  routerPath: '/user'
})

export const useUserStore = useStore
