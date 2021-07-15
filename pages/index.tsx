import Head from 'next/head'
import Image from 'next/image'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Layout from '../components/layout'
import Paper from '@material-ui/core/Paper'
import Toolbar from '@material-ui/core/Toolbar'

export default function Home() {
  return (
    <Layout>
      <Toolbar>
        <Typography variant="h6">SAMPLE GRID</Typography>
        <div className="flex-1" />
        <Button variant="contained" color="secondary" className="mr-2">
          hellow
        </Button>
        <Button variant="contained" color="secondary">
          hellow
        </Button>
      </Toolbar>
      <div>
        <Paper className="mt-2 p-6">
          <div>
            <Typography variant="h4" component="h1" gutterBottom>
              Next.js example
            </Typography>
            <Button variant="outlined" color="secondary">
              hellow
            </Button>
          </div>
        </Paper>
      </div>
    </Layout>
  )
}
