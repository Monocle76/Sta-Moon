var Datastore = require("nedb")
const path = require("node:path/win32")

var donutList = new Datastore({ filename: path.join(__dirname, "db/donuts.json") })
donutList.loadDatabase((err) => err && console.log(err))

exports.handler = async function (event, context) {
    if (event.httpMethod === "POST") {
        var data = JSON.parse(event.body)
        var donut = data.donut
        console.log("Donut Detected:", donut)
        donutList.insert({donut: donut})
        return {
            statusCode: 200,
             body: JSON.stringify({
                message: "Donut Detected: " + donut
            })
        }
    } else if (event.httpMethod === "GET") {
        var donuts = await GetDonuts()
        // console.log(donuts);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Donut Detected",
                donutList: donuts,
            })
        }
    } else if (event.httpMethod === "DELETE") {
        var body = JSON.parse(event.body)
        donutList.remove(body, {}, (err, num) => {console.log("Removed", num);})
        console.log("Delete", body);
        var donuts = await GetDonuts()
        console.log(donuts);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Donut Detected",
                donutList: donuts,
            })
        }
    }
}

async function GetDonuts() {
    let docs = await new Promise((resolve, reject) => {
        donutList.find({}, (err, docs) => {
            resolve(docs)
        })
    })
    return docs
}
