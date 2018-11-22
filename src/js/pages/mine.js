
export default function mine (req, res, next) {

    const { query, params, body } = req;
    
    res.render(`
        <div>Mine Router</div>
        <div>切换到 Mine Router</div>
        <div>Current Day: ${body.curday}</div>
    `)
}
