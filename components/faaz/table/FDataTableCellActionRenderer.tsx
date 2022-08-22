import MenuIcon from '@mui/icons-material/Menu'
import { useRouter } from 'next/dist/client/router'
import { useSnackbar } from 'notistack'
import React, { useState } from "react"
import useModal from '../../hooks/useModal'
import IconButtonMenu from '../../mui/IconButtonMenu'

const FDataTableCellActionRenderer = ({ rowData, rowIndex, actions }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const { _openModal } = useModal(
    (state) => ({ _openModal: state._openModal }),
    () => true
  )
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const router = useRouter()

  return (
    <>
      <IconButtonMenu
        size="small"
        menus={actions}
        data={{
          data: rowData,
          index: rowIndex,
          openModal: _openModal,
          closeMenu: handleClose,
          enqueueSnackbar,
          router,
        }}
      >
        <MenuIcon />
      </IconButtonMenu>
    </>
  )
}

export default FDataTableCellActionRenderer
