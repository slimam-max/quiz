async function examget(url) {
    const request = await fetch(url)
    const data = request.json()
    return data
}
examget('exams/economics.json').then(data=>{console.log(data)})
.catch(err=>{console.log(err)})