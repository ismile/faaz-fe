import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Toolbar from '@mui/material/Toolbar'

import storeCreator from '../components/creators/storeCreator'
import dataTableCreator from '../components/creators/dataTableCreator'

import IconButton from '@mui/material/IconButton'

import { useEffect } from 'react'
import FilterListIcon from '@mui/icons-material/FilterList'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useUserStore } from '../stores/UserStore'
import tw from 'twin.macro'

export default function User() {
  const [_toggleFilterOpen, _fetch] = useUserStore(
    (state) => [state._toggleFilterOpen, state._fetch],
    (ps, ns) => true
  )

  useEffect(() => {
    _fetch()
  }, [])

  return (
    <div tw="h-full w-full flex flex-col">
      <Toolbar>
        <Typography variant="h6">SAMPLE GRID</Typography>
        <div tw="flex-1" />
        <DefaultTopAction />
      </Toolbar>

      {/* <Paper tw="mt-2 p-6"> */}
      <Paper tw="flex flex-1 flex-row mb-1">
        <TableFilter />
        <div tw="flex-1 flex flex-col w-full">
          <div tw="flex-1 flex-row">
            <DataTable />
          </div>
          <Toolbar tw="flex flex-row">
            <IconButton onClick={_toggleFilterOpen}>
              <FilterListIcon />
            </IconButton>
            <div tw="flex-1" />
            <TablePagination />
          </Toolbar>
        </div>
      </Paper>

      {/* </Paper> */}
    </div>
  )
}

const { DataTable, TableFilter, TablePagination, DefaultTopAction } =
  dataTableCreator({
    useStore: useUserStore,
    colAction: true,
    actions: [
      {
        label: 'Edit',
        icon: EditIcon,
        action: ({data, router}) => {
          router.push(`${useUserStore.getState().apiPath}/${data.id}`)
        }
      },{
        label: 'Delete',
        icon: DeleteIcon,
        action: async ({data, openModal, closeMenu, enqueueSnackbar}) => {
          var d = await openModal({
            body: 'Apakah anda yakin akan menghapus data ini?',
          })
          closeMenu()
          if (d) {
            await useUserStore.getState()._delete(data.id, true)
            enqueueSnackbar('Data telah berhasil di hapus.', {
              variant: 'success',
            })
          }
        }
      }
    ],
    columns: [
      {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
        width: 100,
      },
      {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        resizeable: true,
        width: 800,
      },
    ],
  })
