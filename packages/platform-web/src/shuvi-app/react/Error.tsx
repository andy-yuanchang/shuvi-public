import * as React from 'react';
import { Head } from './head/index.js';

const style = {
  container: {
    color: '#000',
    background: '#fff',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  error: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  errorCode: {
    fontSize: '24px',
    fontWeight: 500
  },
  errorDesc: {
    fontSize: '16px',
    lineHeight: '1',
    borderLeft: '1px solid rgba(0, 0, 0, 0.3)',
    paddingLeft: '20px',
    marginLeft: '20px'
  }
} as const;

export default function Error({
  errorCode,
  errorDesc
}: {
  errorCode?: number;
  errorDesc?: string;
}) {
  return (
    <div style={style.container}>
      <Head>
        <title>Page Error</title>
      </Head>

      <div style={style.error}>
        <div style={style.errorCode}>{errorCode}</div>
        <div style={style.errorDesc}>{errorDesc || 'Error'}</div>
      </div>
    </div>
  );
}
