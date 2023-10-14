
export const ERROR_MESSAGES = Object.freeze({
    conflict: (obj: string) => `${obj} already exist`,
    serverErr: 'Ops, unexpected error occures, please try again',
    unavailableService: 'service not availale, please try again later',
    notFound: (obj: string) => `${obj} not found`
})