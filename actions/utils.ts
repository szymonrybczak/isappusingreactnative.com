import os from 'os'
import { join } from 'path'

export const getDownloadPath = (appName: string) => {
  return join(os.tmpdir(), appName, `${appName}.apk`)
}

