let express = require('express');
let cheerio = require('cheerio');
let superagent = require('superagent');

function clearSpace(str) {
    return str.replace(/\s/g, '');
}

let app = express();

app.get('/api/cet', (req, res) => {
    let zkzh = req.query.zkzh;
    let xm = req.query.xm;
    let cb = req.query.callback;

    if (cb !== undefined) {
        xm = encodeURI(xm);
    }

    // 跨域响应头
    res.header('Access-Control-Allow-Origin', '*');
    
    superagent
        .get(`http://www.chsi.com.cn/cet/query?zkzh=${zkzh}&xm=${xm}`)
        .set('Referer', 'http://www.chsi.com.cn/cet/')
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.62 Safari/537.36')
        .end(function(err, body){
            let $ = cheerio.load(body.text);
            let data = {};

            // 查询错误
            let errorText = clearSpace($('.error').text());
            if (errorText !== '') {
                data = {
                    "code": 400,
                    "msg": errorText
                }
                res.json(data);
                res.end();
                return;
            }

            let name = clearSpace($('.m_cnt_m>table>tbody>tr:nth-of-type(1)>td:nth-of-type(1)').text());
            let school = clearSpace($('.m_cnt_m>table>tbody>tr:nth-of-type(2)>td:nth-of-type(1)').text());
            let type = clearSpace($('.m_cnt_m>table>tbody>tr:nth-of-type(3)>td:nth-of-type(1)').text());
            let total = clearSpace($('.m_cnt_m>table>tbody>tr:nth-of-type(6)>td:nth-of-type(1)>span').text());
            let listening = clearSpace($('.m_cnt_m>table>tbody>tr:nth-of-type(7)>td:nth-of-type(2)').text());
            let read =clearSpace($('.m_cnt_m>table>tbody>tr:nth-of-type(8)>td:nth-of-type(2)').text());
            let writing = clearSpace($('.m_cnt_m>table>tbody>tr:nth-of-type(9)>td:nth-of-type(2)').text());

            data.name = name;
            data.school = school;
            data.type = type;
            data.total = total;
            data.listening = listening;
            data.read = read;
            data.writing = writing;

            if (cb !== undefined) {
                try {
                    data = {
                        code: 200,
                        msg: '查询成功',
                        data
                    };
                } catch(e) {

                }
                res.send(`${cb}(${JSON.stringify(data)})`);
            } else {
                res.json({
                    code: 200,
                    msg: '查询成功',
                    data
                }).end();
            }
        });
});

let server = app.listen(8081);
