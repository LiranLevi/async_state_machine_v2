const MAX_MILI_SEC = 10;
const MIN_MILI_SEC = 1;

const Promise = require("bluebird");

const task = (task_time_in_ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("");
        }, task_time_in_ms);
    })
}

async function step(state, resolver, next, exception, flow_id, flow_name) {
    const start = new Date();
    try {
        await task(Math.floor(Math.random() * (MAX_MILI_SEC - MIN_MILI_SEC) + MIN_MILI_SEC) * 1000).timeout(9000);
        const end = new Date() - start;
        console.log("{flow_id: %d, flow_name: %s, state: %s, start_time: %s, execution_time: %dms}",
        flow_id, flow_name, state, start, end);
        return next;
    } catch (err) {
        console.log("{flow_id: %d, flow_name: %s, state: %s, start_time: %s, err: '%s' of '%s' fails because execution time is more than 9 seconds}",
        flow_id, flow_name, state, start, resolver, state);
        return exception;
    }
}

module.exports = async function run_flow(flow, flow_id) {
    try {
        let state = await step(flow.startAt, flow.states[flow.startAt].resolver,
            flow.states[flow.startAt].next, flow.states[flow.startAt].exception, flow_id, flow.flow);
        while(state !== "stop") {
            state = await step(state, flow.states[state].resolver,
                flow.states[state].next, flow.states[state].exception, flow_id, flow.flow);
        }
        const start = new Date();
        console.log("{flow_id: %d, flow_name: %s, state: finished, start_time: %s, execution_time: 0ms}",
        flow_id, flow.flow, start);
    } catch (err) {
        console.log("ERROR: " + err);
    }
}
