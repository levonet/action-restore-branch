const github = require('../lib/github')

describe('github', () => {
    describe('test isNotLimit()', () => {
        test('no limit if zero', () => {
            expect(github.isNotLimit(0, 0)).toEqual(true)
            expect(github.isNotLimit(1, 0)).toEqual(true)
            expect(github.isNotLimit(100000, 0)).toEqual(true)
        })
        test('limit is not exceeded', () => {
            expect(github.isNotLimit(-1, 10)).toEqual(true)
            expect(github.isNotLimit(1, 1)).toEqual(true)
            expect(github.isNotLimit(1, 10)).toEqual(true)
            expect(github.isNotLimit(100000, 100000)).toEqual(true)
        })
        test('limit is exceeded', () => {
            expect(github.isNotLimit(-1, -2)).toEqual(false)
            expect(github.isNotLimit(2, 1)).toEqual(false)
            expect(github.isNotLimit(11, 10)).toEqual(false)
            expect(github.isNotLimit(100001, 100000)).toEqual(false)
        })
    })
    // TODO: https://github.com/getsentry/action-git-diff-suggestions/blob/main/__tests__/deleteOldReviewComments.test.ts
})
