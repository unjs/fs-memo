import { promises as fs } from 'fs'
import { resolve, dirname } from 'path'

const _memo = {
  _pid: process.pid
}

interface MemoOptions {
  dir: string
  name: string,
  file: string
}

export async function getMemo (config: Partial<MemoOptions>): Promise<any> {
  const file = getFile(config)

  // Try to load latest memo
  try {
    const memo = JSON.parse(await fs.readFile(file, 'utf-8')) || {}
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
  const file = getFile(config)

  // Set local memo
  Object.assign(_memo, memo)
  _memo._pid = process.pid

  // Try to persist
  try { await fs.mkdir(dirname(file)) } catch (e) { }
  try { await fs.writeFile(file, JSON.stringify(_memo), 'utf-8') } catch (e) { }
}

function getFile (config: Partial<MemoOptions>): string {
  if (config.file) {
    return config.file
  }
  return resolve(
    config.dir || resolve(process.cwd(), 'node_modules/.cache/fs-memo'),
    (config.name || 'default') + '.json'
  )
}

function isAlive (pid: number): Boolean {
  try {
    process.kill(pid, 0)
    return true
  } catch (e) {
    return e.code === 'EPERM'
  }
}
