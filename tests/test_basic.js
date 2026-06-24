const fs = require('fs')

test('public/index.html exists', () => {
  const exists = fs.existsSync('public/index.html')
  expect(exists).toBe(true)
})
