# fs-memo

> Easy persisted memo object for Node.js

[![npm](https://img.shields.io/npm/dt/fs-memo.svg?style=flat-square)](https://npmjs.com/package/fs-memo)
[![npm (scoped with tag)](https://img.shields.io/npm/v/fs-memo/latest.svg?style=flat-square)](https://npmjs.com/package/fs-memo)

## Usage

Install package:

```bash
yarn add fs-memo
# or
or npm install fs-memo
```

```js
const { getMemo, setMemo } = require('fs-memo')
// or
import { getMemo, setMemo } from 'fs-memo'
```


### `getMemo(options)`

```ts
getMemo(options: MemoOptions): Promise<any>
```

Load latest memo from file-system and combine with local state from CJS cache.

FS loading silently bails if:
 - The process that made memo is still alive with different pid
 - Any fs error happens (like permission denied)

### `setMemo(eoptions)`

```ts
setMemo(memo: object, options: MemoOptions): Promise<void>
```

Update local state from CJS cache and persist memo object to file-system.

FS persistence silently bails if any error happens.

## Options

```ts
interface MemoOptions {
  dir?: string
  name?: string
}
```

### `dir`

Specify directory where memo file should be stored. Default dir is `__dirname` (`node_modules/fs-memo/dist`)

### `name`

Name of memo file. Default name is `.fs-memo`.

## License

MIT
