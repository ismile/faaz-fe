import storeCreator from "../components/creators/storeCreator";

const { useStore } = storeCreator({
  apiPath: '/user',
  routerPath: '/user'
})

export const useUserStore = useStore
