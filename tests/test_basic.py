import fs from 'fs'

test('public/index.html exists', () => {
    const exists = require('fs').existsSync('public/index.html')
    expect(exists).toBe(true)
})
