const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
        .then(() => {
            console.log('Texte copié !')
        })
        .catch(err => {
            console.error('Erreur lors de la copie :', err)
        })
}

export { copyText }
