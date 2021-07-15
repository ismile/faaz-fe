import Head from 'next/head'
import Image from 'next/image'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Layout from '../components/layout'
import Paper from '@material-ui/core/Paper'

export default function Home() {
  return (
    <Layout>
      <div>
        <Paper className="mt-6 p-6">
          <div>
            <Typography variant="h4" component="h1" gutterBottom>
              Next.js example
            </Typography>
            <Button variant="contained" color="primary">
              hellow
            </Button>
            <button
              className="flex-none bg-deep-purple flex items-center justify-center w-9 h-9 rounded-md text-gray-400 border border-gray-300"
              type="button"
              aria-label="like"
            >
              <svg width="20" height="20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                />
              </svg>
            </button>
          </div>
        </Paper>
        <Paper className="mt-6 p-6">
          <div>
            <Typography variant="h4" component="h1" gutterBottom>
              Next.js example
            </Typography>
            <Button variant="contained" color="primary">
              hellow
            </Button>
            <button
              className="flex-none bg-deep-purple flex items-center justify-center w-9 h-9 rounded-md text-gray-400 border border-gray-300"
              type="button"
              aria-label="like"
            >
              <svg width="20" height="20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                />
              </svg>
            </button>
          </div>
        </Paper>
        <Paper className="mt-6 p-6">
          <div>
            <Typography variant="h4" component="h1" gutterBottom>
              Next.js example
            </Typography>
            <Button variant="contained" color="primary">
              hellow
            </Button>
            <button
              className="flex-none bg-deep-purple flex items-center justify-center w-9 h-9 rounded-md text-gray-400 border border-gray-300"
              type="button"
              aria-label="like"
            >
              <svg width="20" height="20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                />
              </svg>
            </button>
          </div>
        </Paper>
      </div>
    </Layout>
  )
}
