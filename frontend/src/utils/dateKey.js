export const dateKey = (date) => {
    const d = date instanceof Date ? date : new Date()
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}