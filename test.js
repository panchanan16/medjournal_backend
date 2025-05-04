

function x(name) {
    const pageUrl = name.split(' ').map((el)=> el.charAt(0).toLowerCase() + el.slice(1)).join('-')
    console.log(pageUrl)
}


x('Panchanan')