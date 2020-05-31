import { promises as fs } from 'fs'
import { resolve } from 'path'

const _memo = {
  _pid: process.pid
}

const defaults = {
  dir: __dirname,
  name: '.fs-memo'
}

type MemoOptions = Partial<typeof defaults>

export async function getMemo (options: MemoOptions): Promise<any> {
  const { file } = getOptions(options)

  // Try to load latest memo
  try {
    const memo = JSON.parse(await fs.readFile(file, 'utf-8')) || {}
    if (!memo._pid) {
      throw new Error('InvalidMemo')
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

export async function setMemo (memo: object, options: MemoOptions): Promise<void> {
  const { file } = getOptions(options)

  // Set local memo
  Object.assign(_memo, memo)
  _memo._pid = process.pid

  // Try to persist
  try {
    await fs.writeFile(file, JSON.stringify(_memo), 'utf-8')
  } catch (e) {
    // Ignore
  }
}

function getOptions (options: MemoOptions): typeof defaults & { file: string } {
  const opts: any = { ...defaults, options }
  opts.file = resolve(opts.dir, opts.name)
  return opts
}

function isAlive (pid: number): Boolean {
  try {
    process.kill(pid, 0)
    return true
  } catch (e) {
    return e.code === 'EPERM'
  }
}
