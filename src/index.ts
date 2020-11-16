import { promises as fs } from 'fs'
import { resolve } from 'path'

const _memo = {
  _pid: process.pid
}

interface MemoOptions {
  dir: string
  name: string,
  file: string
}

export async function getMemo (config: Partial<MemoOptions>): Promise<any> {
  const options = getOptions(config)

  // Try to load latest memo
  try {
    const memo = JSON.parse(await fs.readFile(options.file, 'utf-8')) || {}
    if (!memo._pid) {
      throw new Error('Memo lacks _pid')
    }
    if (
      memo._pid === _memo._pid || // fs is more reliable than require cache
      !isAlive(memo.pid) // RIP
    ) {
      Object.assign(_memo, memo)
      _memo._pid = process.pid
    }
  } catch (e) {
    // Ignore
  }

  return _memo
}

export async function setMemo (memo: object, config: Partial<MemoOptions>): Promise<void> {
  const options = getOptions(config)

  // Set local memo
  Object.assign(_memo, memo)
  _memo._pid = process.pid

  // Try to persist
  try { await fs.mkdir(options.dir) } catch (e) { }
  try { await fs.writeFile(options.file, JSON.stringify(_memo), 'utf-8') } catch (e) { }
}

function getOptions (config: Partial<MemoOptions>): MemoOptions {
  const options = { ...config }
  options.name = options.name || 'default'
  options.dir = options.dir || resolve(process.cwd(), 'node_modules/.cache/fs-memo')
  options.file = options.file || resolve(options.dir, options.name + '.json')
  return options as MemoOptions
}

function isAlive (pid: number): Boolean {
  try {
    process.kill(pid, 0)
    return true
  } catch (e) {
    return e.code === 'EPERM'
  }
}
