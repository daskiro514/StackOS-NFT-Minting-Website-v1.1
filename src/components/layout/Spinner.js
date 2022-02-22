import React, { Fragment } from 'react'
import spinner from './spinner1.gif'

const Spinner = () => (
  <Fragment>
    <img
      src={spinner}
      style={{ width: '200px', margin: 'auto', display: 'block' }}
      alt="Loading..."
    />
  </Fragment>
)

export default Spinner
