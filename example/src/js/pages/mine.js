
export default function mine (req, res, next) {

    const { query, params, body } = req;
    
    res.render(`
        <div>Mine Router</div>
        <div>当前动态参数：${params.id}</div>
        <div>Current Day: ${body.curday}</div>
    `)
}
