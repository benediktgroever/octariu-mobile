var PROTOCOL = "https"
var OSUBMIT = "osubmit.octariu.com"

if (process.env.NODE_ENV === "development") {
    if (process.env.REACT_APP_ENV === "local") {
        PROTOCOL = "http";
        OSUBMIT = "127.0.0.1:8080"
    } else if (process.env.REACT_APP_ENV === "staging") {
        OSUBMIT = "staging.osubmit.octariu.com"
    }
}

PROTOCOL = 'http'
OSUBMIT = '192.168.1.9:8080'

export {
    PROTOCOL,
    OSUBMIT
}