import os from 'os'
import { join } from 'path'

export const getDownloadPath = (appId: string) => {
  return join(os.tmpdir(), `${appId}-dir`, `${appId}.apk`)
}

