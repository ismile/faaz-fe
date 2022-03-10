import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Toolbar from '@mui/material/Toolbar'
import dataTableCreator from '../../components/creators/dataTableCreator'
import IconButton from '@mui/material/IconButton'
import FilterListIcon from '@mui/icons-material/FilterList'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { IUserModel, useUserStore } from '../../stores/UserStore'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import ButtonGroup from '@mui/material/ButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ListIcon from '@mui/icons-material/List'
import GridViewIcon from '@mui/icons-material/GridView'
import Divider from '@mui/material/Divider'
import { useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import CardActionArea from '@mui/material/CardActionArea'
import Grid from '@mui/material/Grid'

export default function User() {
  const [_toggleFilterOpen, _fetch] = useUserStore(
    (state) => [state._toggleFilterOpen, state._fetch],
    (ps, ns) => true
  )
  const [view, setView] = useState('table')

  return (
    <Box
      sx={{
        height: '100%',
        weight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Toolbar className="animate__animated animate__delay-200ms animate__faster animate__fadeInDown">
        <Box sx={{ flex: 1, display: { xs: 'none', sm: 'flex' } }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          SAMPLE GRID
        </Typography>
        <Box sx={{ flex: 1, display: 'flex' }}>
          <Box sx={{ flex: 1 }} />

          <DefaultTopAction />
        </Box>
      </Toolbar>

      <Container sx={{ flex: 1, display: 'flex' }}>
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
              width: '100%',
            }}
          >
            <Box sx={{ flex: 1 }}>
              {view == 'table' && <DataTable />}
              {view == 'grid' && (
                <CustomView
                  ItemContainer={({ children }) => (
                    <Grid container spacing={4} padding={4}>
                      {children}
                    </Grid>
                  )}
                  ItemTemplate={({ data }) => (
                    <Grid item xs={12} md={4} lg={3}>
                      <Card>
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            height="140"
                            image="https://picsum.photos/140/366"
                            alt="green iguana"
                          />
                          <CardContent>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                            >
                              {data.firstName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Lizards are a widespread group of squamate
                              reptiles, with over 6,000 species, ranging across
                              all continents except Antarctica
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  )}
                />
              )}
            </Box>
            <Toolbar sx={{ display: 'flex', flexDirection: 'row', borderTop: '1px solid rgba(0,0,0,.2)'}}>
              <IconButton sx={{ marginRight: 2 }} onClick={_toggleFilterOpen}>
                <FilterListIcon />
              </IconButton>
              <Divider sx={{ marginRight: 3 }} orientation="vertical" />
              <ToggleButtonGroup
                size="small"
                exclusive
                value={view}
                onChange={(e, v) => setView(v)}
              >
                <ToggleButton value="table">
                  <ListIcon />
                </ToggleButton>
                <ToggleButton value="grid">
                  <GridViewIcon />
                </ToggleButton>
              </ToggleButtonGroup>
              <Box sx={{ flex: 1 }} />
              <TablePagination />
            </Toolbar>
          </Box>
        </Paper>
      </Container>
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
  CustomView,
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
          showSnackbar('Data telah berhasil di hapus.', {
            variant: 'success',
          })
        }
      },
    },
  ],
  columns: [
    {
      title: 'Nama',
      dataIndex: 'nama',
      key: 'nama',
      width: 100,
    },
    {
      title: 'Nomor Identitas',
      dataIndex: 'nomorIdentitas',
      key: 'nomorIdentitas'
    },
    {
      title: 'Nama User',
      dataIndex: 'namaUser',
      key: 'namaUser'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      resizeable: true
    },
  ],
})
