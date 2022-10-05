import React, { useEffect, useRef, useState } from 'react'
import useElementSize from '../hooks/useElementSize'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'

const FDataView = ({
  useStore,
  ItemTemplate,
  ItemContainer = ({ children }) => <div>{children}</div>,
  dataKey = 'id'
}) => {
  const data = useStore(
    (state) => state.data,
    (o, n) => JSON.stringify(o) == JSON.stringify(n)
  )

  const loading = useStore(
    (state) => state.loading,
    (o, n) => o == n
  )

  const squareRef = useRef(null)
  const { width, height } = useElementSize(squareRef)

  return (
    <Box sx={{ height: '100%', width: '100%' }} ref={squareRef}>
      <Box
        sx={{ position: 'fixed', overflow: 'auto' }}
        style={{ width, height }}
      >
        {loading && (
          <LinearProgress
            sx={{
              position: 'absolute',
              marginTop: '0px',
              zIndex: 200,
              width: '100%',
            }}
          />
        )}

        <ItemContainer>
          {data.map((d, i) => (
            <ItemTemplate key={d[dataKey]?d[dataKey]:i} data={d} />
          ))}
        </ItemContainer>
      </Box>
    </Box>
  )
}

export default FDataView
