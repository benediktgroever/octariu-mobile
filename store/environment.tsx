let PROTOCOL = "https"
let OSUBMIT = "osubmit-56nyl7rlmq-uc.a.run.app"

if (__DEV__) {
    console.log("connecting to local...")
    PROTOCOL = 'http'
    OSUBMIT = '192.168.1.9:8080'
}

export {
    PROTOCOL,
    OSUBMIT
}