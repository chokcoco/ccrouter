
export default function home (req, res, next) {

    const { query, params, body } = req;
    
    res.render(`
        <div>Home Router</div>
        <div>切换到 Home Router</div>
        <div>Current Day: ${body.curday}</div>
    `)
}
