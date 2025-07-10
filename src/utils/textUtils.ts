const copyText = (text: string): Promise<void> => {
    return navigator.clipboard.writeText(text)
}

export { copyText }
