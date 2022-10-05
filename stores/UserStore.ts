import storeCreator from '../components/faaz/store/storeCreator'

export interface IUserModel {
  id: string
  firstName: string
  lastName: string
}

export const useUserStore = storeCreator<IUserModel, {
  test: ()=> void,
}>((set, get) => ({
  apiPath: '/api/user',
  routerPath: '/user',

  test: ()=> {console.log(get().apiPath)}
}))
