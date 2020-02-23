import fetch from "isomorphic-fetch";

const BASE_URL = "https://api.zeit.co";

export async function deploy() {
    // make API request to ZEIT
    // using their deployment api
    // https://zeit.co/docs/api#endpoints/deployments

    // ignoring rate limits for now
    const response = await fetch(`${BASE_URL}/v12/now/deployments`, {
        headers: {
            "Content-Type": "application/json",
            // TODO: must use secrets management for this to be safe
            Authorization: "Bearer VhlDaoiMSLGzLt3ANoJKAK4S"
        },
        method: "POST",
        body: JSON.stringify({
            name: "my-test-deployment",
            files: [
                {
                    file: "index.html",
                    data: `<!doctype html><html><title>hello</title><body>hello world</body></html>`
                }
            ],
            projectSettings: {
                framework: null
            }
        })
    }).then(res => res.json());

    console.log(response);
}
