import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Toolbar from '@mui/material/Toolbar'
import dataTableCreator from '../components/creators/dataTableCreator'
import IconButton from '@mui/material/IconButton'
import FilterListIcon from '@mui/icons-material/FilterList'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { IUserModel, useUserStore } from '../stores/UserStore'
import Box from '@mui/material/Box'

export default function User() {
  const [_toggleFilterOpen, _fetch] = useUserStore(
    (state) => [state._toggleFilterOpen, state._fetch],
    (ps, ns) => true
  )

  return (
    <Box
      sx={{
        height: '100%',
        weight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Toolbar>
        <Typography variant="h6">SAMPLE GRID</Typography>
        <Box sx={{ flex: 1 }} />
        <DefaultTopAction />
      </Toolbar>

      <Paper
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'row',
          marginBottom: '0.25rem',
        }}
      >
        <TableFilter />
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          <Box sx={{flex: 1, flexDirection: 'row'}}>
            <DataTable />
          </Box>
          <Toolbar sx={{display: 'flex', flexDirection: 'row'}}>
            <IconButton onClick={_toggleFilterOpen}>
              <FilterListIcon />
            </IconButton>
            <Box sx={{flex: 1}} />
            <TablePagination />
          </Toolbar>
        </Box>
      </Paper>
      <TableWatcher />

      {/* </Paper> */}
    </Box>
  )
}

const {
  DataTable,
  TableFilter,
  TablePagination,
  TableWatcher,
  DefaultTopAction,
} = dataTableCreator<IUserModel>({
  useStore: useUserStore,
  actions: [
    {
      label: 'Edit',
      icon: EditIcon,
      disabled: (d, i) => {
        return d.firstName == 'Ismail'
      },
      action: ({ data, router }) => {
        router.push(`${useUserStore.getState().apiPath}/${data.id}`)
      },
    },
    {
      label: 'Delete',
      icon: DeleteIcon,
      action: async ({ data, openModal, closeMenu, enqueueSnackbar }) => {
        var d = await openModal({
          body: 'Apakah anda yakin akan menghapus data ini?',
        })
        closeMenu()
        if (d) {
          var res = await useUserStore.getState()._delete(data.id, true)
          enqueueSnackbar('Data telah berhasil di hapus.', {
            variant: 'success',
          })
        }
      },
    },
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
