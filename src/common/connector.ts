export async function aoe4worldConnector(url: string) {
    const res = await fetch(url)
    const data = res.json()

    // Pass data to the page via props
    return data
}