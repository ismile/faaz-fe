import React, { useEffect, useRef, useState } from 'react'
import { useHash } from '../hooks/useHash'
import queryString from 'query-string'

const FDataTableWatcher = ({useStore}) => {
  const [hash, setHash] = useHash()
  const [_fetch] = useStore(
    (state) => [state._fetch],
    (ps, ns) => true
  )
  useEffect(() => {
    var query = queryString.parse(hash)

    _fetch(query)
  }, [hash])

  return <div />
}

export default FDataTableWatcher
